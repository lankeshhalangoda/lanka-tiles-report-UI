"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Pencil } from "lucide-react"
import { getTileImagePath } from "./customer-form"
import Image from "next/image"
import { readFloorDragPayload } from "@/components/floor-plan/furniture-palette"
import type { GridMetrics } from "@/components/floor-plan/types"
import { cn } from "@/lib/utils"

export type TileLayoutMode = "draw" | "furnish"

interface DrawableGridProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  dimensions: { width: number; height: number }
  selectedTileColor?: string
  layoutMode?: TileLayoutMode
  paletteDragging?: boolean
  onFurnitureDrop?: (detail: {
    catalogItemId: string
    gridX: number
    gridY: number
  }) => void
  onFurnishClearSelection?: () => void
  renderFurniture?: (
    metrics: GridMetrics,
    floorRef: React.RefObject<HTMLDivElement | null>,
  ) => React.ReactNode
}

export function DrawableGrid({
  canvasRef,
  dimensions,
  selectedTileColor = "",
  layoutMode = "draw",
  paletteDragging = false,
  onFurnitureDrop,
  onFurnishClearSelection,
  renderFurniture,
}: DrawableGridProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil")
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })
  const [tileImagePath, setTileImagePath] = useState("/tiles/tile-ivory.jpeg")
  const [cellSize, setCellSize] = useState({ width: 60, height: 60 })
  const gridRef = useRef<HTMLDivElement>(null)

  // Update tile image path when selected color changes
  useEffect(() => {
    setTileImagePath(getTileImagePath(selectedTileColor))
  }, [selectedTileColor])

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const updateGridSize = () => {
      const containerWidth = el.clientWidth
      if (containerWidth < 1) return

      const cell = containerWidth / dimensions.width
      setCanvasSize({
        width: containerWidth,
        height: cell * dimensions.height,
      })
      setCellSize({
        width: cell,
        height: cell,
      })
    }

    updateGridSize()
    const ro = new ResizeObserver(() => updateGridSize())
    ro.observe(el)
    window.addEventListener("resize", updateGridSize)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", updateGridSize)
    }
  }, [dimensions.width, dimensions.height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return

    context.lineCap = "round"
    context.strokeStyle = "#231f20"
    context.lineWidth = 2
    contextRef.current = context
  }, [canvasRef, canvasSize])

  const handleFloorDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!onFurnitureDrop || !gridRef.current) return
      const id = readFloorDragPayload(e)
      if (!id) return
      const rect = gridRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const gx = Math.floor(x / cellSize.width)
      const gy = Math.floor(y / cellSize.height)
      onFurnitureDrop({ catalogItemId: id, gridX: gx, gridY: gy })
    },
    [cellSize.height, cellSize.width, onFurnitureDrop],
  )

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (layoutMode === "furnish") return
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    setIsDrawing(true)

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
    context.strokeStyle = tool === "pencil" ? "#231f20" : "#ffffff"
    context.lineWidth = tool === "pencil" ? 2 : 10
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (layoutMode === "furnish" || !isDrawing) return

    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling while drawing
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    const context = contextRef.current
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Generate grid cells based on dimensions
  const renderGridCells = () => {
    const cells = []
    for (let y = 0; y < dimensions.height; y++) {
      for (let x = 0; x < dimensions.width; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            className="relative border border-gray-300"
            style={{
              width: cellSize.width,
              height: cellSize.height,
            }}
          >
            <Image
              src={tileImagePath || "/placeholder.svg"}
              alt="Tile"
              fill
              sizes={`${cellSize.width}px`}
              className="object-cover"
            />
          </div>,
        )
      }
    }
    return cells
  }

  const metrics: GridMetrics = {
    cellSize,
    canvasSize,
    dimensions,
  }

  return (
    <div className="w-full space-y-4">
      {layoutMode === "draw" && (
        <div className="mb-2 flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant={tool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("pencil")}
              className={tool === "pencil" ? "bg-[#f02424] hover:bg-[#d01414]" : ""}
            >
              <Pencil className="mr-1 h-4 w-4" /> Draw
            </Button>
            <Button
              variant={tool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("eraser")}
              className={tool === "eraser" ? "bg-[#f02424] hover:bg-[#d01414]" : ""}
            >
              <Eraser className="mr-1 h-4 w-4" /> Erase
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            Clear
          </Button>
        </div>
      )}

      <div
        className="relative w-full max-w-full overflow-hidden rounded-md border"
        ref={gridRef}
      >
        {/* Tile grid */}
        <div
          className="absolute left-0 top-0 z-0 grid"
          style={{
            gridTemplateColumns: `repeat(${dimensions.width}, ${cellSize.width}px)`,
            gridTemplateRows: `repeat(${dimensions.height}, ${cellSize.height}px)`,
            width: canvasSize.width,
            height: canvasSize.height,
          }}
        >
          {renderGridCells()}
        </div>

        {layoutMode === "furnish" && onFurnishClearSelection && (
          <div
            role="presentation"
            className="absolute inset-0 z-[2]"
            onPointerDown={() => onFurnishClearSelection()}
          />
        )}

        {renderFurniture?.(metrics, gridRef)}

        {paletteDragging && onFurnitureDrop && (
          <div
            className="absolute inset-0 z-[60] bg-black/10"
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = "copy"
            }}
            onDrop={handleFloorDrop}
          />
        )}

        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={cn(
            "relative z-10 touch-none bg-transparent",
            layoutMode === "furnish" && "pointer-events-none",
          )}
        />
      </div>
      <p className="text-center text-xs text-[#231f20]/70">
        {layoutMode === "furnish"
          ? "Drag fixtures from the palette onto the floor. Select an item to rotate, flip, or snap to tiles."
          : "Draw your tile layout on the grid. Use the pencil to draw and eraser to remove lines."}
      </p>
    </div>
  )
}
