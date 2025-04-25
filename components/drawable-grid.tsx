"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Pencil } from "lucide-react"
import { tileOptions } from "./customer-form"
import Image from "next/image"

interface DrawableGridProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  dimensions: { width: number; height: number }
  selectedTileColor?: string
}

export function DrawableGrid({ canvasRef, dimensions, selectedTileColor = "" }: DrawableGridProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil")
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })
  const [tileImagePath, setTileImagePath] = useState("/tiles/tile-ivory.jpeg")
  const [cellSize, setCellSize] = useState({ width: 60, height: 60 })
  const gridRef = useRef<HTMLDivElement>(null)

  // Update tile image path when selected color changes
  useEffect(() => {
    const selectedTile = tileOptions.find((tile) => tile.value === selectedTileColor)
    if (selectedTile) {
      setTileImagePath(selectedTile.imagePath)
    }
  }, [selectedTileColor])

  useEffect(() => {
    // Set grid size based on container width
    const updateGridSize = () => {
      if (gridRef.current) {
        const containerWidth = Math.min(window.innerWidth - 40, 500)
        setCanvasSize({
          width: containerWidth,
          height: containerWidth,
        })

        // Calculate cell size based on dimensions
        setCellSize({
          width: containerWidth / dimensions.width,
          height: containerWidth / dimensions.height,
        })
      }
    }

    updateGridSize()
    window.addEventListener("resize", updateGridSize)

    return () => {
      window.removeEventListener("resize", updateGridSize)
    }
  }, [dimensions, gridRef])

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
    if (!isDrawing) return

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        <div className="flex space-x-2">
          <Button
            variant={tool === "pencil" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("pencil")}
            className={tool === "pencil" ? "bg-[#f02424] hover:bg-[#d01414]" : ""}
          >
            <Pencil className="h-4 w-4 mr-1" /> Draw
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("eraser")}
            className={tool === "eraser" ? "bg-[#f02424] hover:bg-[#d01414]" : ""}
          >
            <Eraser className="h-4 w-4 mr-1" /> Erase
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          Clear
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden relative" ref={gridRef}>
        {/* Tile grid */}
        <div
          className="grid absolute top-0 left-0 z-0"
          style={{
            gridTemplateColumns: `repeat(${dimensions.width}, ${cellSize.width}px)`,
            gridTemplateRows: `repeat(${dimensions.height}, ${cellSize.height}px)`,
            width: canvasSize.width,
            height: canvasSize.height,
          }}
        >
          {renderGridCells()}
        </div>

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
          className="touch-none relative z-10 bg-transparent"
        />
      </div>
      <p className="text-xs text-[#231f20]/70 text-center">
        Draw your tile layout on the grid. Use the pencil to draw and eraser to remove lines.
      </p>
    </div>
  )
}
