"use client"

import type { RefObject } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { FloorPlanItemIcon } from "./item-icon"
import { getFloorPlanItemDef } from "./catalog"
import type { GridMetrics, PlacedFloorItem } from "./types"
import { clampGridPosition, effectiveFootprint } from "./types"
import { cn } from "@/lib/utils"

interface PlacedItemsLayerProps {
  metrics: GridMetrics
  floorRef: RefObject<HTMLDivElement | null>
  items: PlacedFloorItem[]
  onItemsChange: React.Dispatch<React.SetStateAction<PlacedFloorItem[]>>
  selectedId: string | null
  onSelectId: (id: string | null) => void
  mode: "draw" | "furnish"
}

export function PlacedItemsLayer({
  metrics,
  floorRef,
  items,
  onItemsChange,
  selectedId,
  onSelectId,
  mode,
}: PlacedItemsLayerProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const itemsRef = useRef(items)
  itemsRef.current = items

  const updateItem = useCallback(
    (instanceId: string, patch: Partial<PlacedFloorItem>) => {
      onItemsChange((prev) =>
        prev.map((p) => (p.instanceId === instanceId ? { ...p, ...patch } : p)),
      )
    },
    [onItemsChange],
  )

  useEffect(() => {
    if (!draggingId) return

    const onMove = (e: PointerEvent) => {
      const floor = floorRef.current
      if (!floor) return
      const item = itemsRef.current.find((i) => i.instanceId === draggingId)
      if (!item) return
      const def = getFloorPlanItemDef(item.catalogItemId)
      if (!def) return
      const { w, h } = effectiveFootprint(
        def.footprintW,
        def.footprintH,
        item.rotation,
      )
      const r = floor.getBoundingClientRect()
      const cw = metrics.cellSize.width
      const ch = metrics.cellSize.height
      const topLeftX = e.clientX - r.left - offsetRef.current.x
      const topLeftY = e.clientY - r.top - offsetRef.current.y
      let gx = topLeftX / cw
      let gy = topLeftY / ch
      if (item.snapped) {
        gx = Math.round(gx)
        gy = Math.round(gy)
      } else {
        gx = Math.floor(gx)
        gy = Math.floor(gy)
      }
      const c = clampGridPosition(
        gx,
        gy,
        w,
        h,
        metrics.dimensions.width,
        metrics.dimensions.height,
      )
      updateItem(draggingId, { gridX: c.gridX, gridY: c.gridY })
    }

    const onUp = () => {
      setDraggingId(null)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp, { capture: true })
    window.addEventListener("pointercancel", onUp, { capture: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp, { capture: true })
      window.removeEventListener("pointercancel", onUp, { capture: true })
    }
  }, [draggingId, floorRef, metrics, updateItem])

  const interactive = mode === "furnish"

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[4]"
      aria-hidden={!interactive}
    >
      {items.map((item) => {
        const def = getFloorPlanItemDef(item.catalogItemId)
        if (!def) return null
        const { w, h } = effectiveFootprint(
          def.footprintW,
          def.footprintH,
          item.rotation,
        )
        const pxW = w * metrics.cellSize.width
        const pxH = h * metrics.cellSize.height
        const left = item.gridX * metrics.cellSize.width
        const top = item.gridY * metrics.cellSize.height
        const selected = item.instanceId === selectedId
        const iconSize = Math.max(16, Math.min(pxW, pxH) * 0.42)

        return (
          <div
            key={item.instanceId}
            title={def.label}
            className={cn(
              "absolute box-border flex select-none items-center justify-center rounded-md border-2 border-[#231f20]/25 bg-white/90 text-[#231f20] shadow-sm backdrop-blur-[1px]",
              selected && "border-[#f02424] ring-2 ring-[#f02424]/30",
              interactive && "pointer-events-auto cursor-grab active:cursor-grabbing",
            )}
            style={{
              left,
              top,
              width: pxW,
              height: pxH,
            }}
            onPointerDown={(e) => {
              if (!interactive) return
              e.stopPropagation()
              onSelectId(item.instanceId)
              const floor = floorRef.current
              if (!floor) return
              const r = floor.getBoundingClientRect()
              offsetRef.current = {
                x: e.clientX - r.left - left,
                y: e.clientY - r.top - top,
              }
              setDraggingId(item.instanceId)
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                transform: `rotate(${item.rotation}deg) scaleX(${item.flipH ? -1 : 1}) scaleY(${item.flipV ? -1 : 1})`,
              }}
            >
              <FloorPlanItemIcon icon={def.icon} size={iconSize} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
