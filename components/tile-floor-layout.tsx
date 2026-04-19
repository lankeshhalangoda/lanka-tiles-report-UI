"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import { DrawableGrid } from "@/components/drawable-grid"
import { FurniturePalette } from "@/components/floor-plan/furniture-palette"
import { PlacedItemsLayer } from "@/components/floor-plan/placed-items-layer"
import { getFloorPlanItemDef } from "@/components/floor-plan/catalog"
import type { PlacedFloorItem } from "@/components/floor-plan/types"
import {
  clampGridPosition,
  effectiveFootprint,
  nextRotation,
} from "@/components/floor-plan/types"
import { getTileImagePath } from "@/components/customer-form"
import { Button } from "@/components/ui/button"
import {
  FlipHorizontal,
  FlipVertical,
  Magnet,
  RotateCw,
  Trash2,
} from "lucide-react"

const FloorPlan3DPreview = dynamic(
  () =>
    import("@/components/floor-plan/floor-plan-3d-preview").then(
      (m) => m.FloorPlan3DPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(420px,52vh)] w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-zinc-50 text-sm text-muted-foreground">
        Loading 3D preview…
      </div>
    ),
  },
)

export type LayoutMode = "draw" | "furnish"

interface TileFloorLayoutProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  dimensions: { width: number; height: number }
  selectedTileColor?: string
}

export function TileFloorLayout({
  canvasRef,
  dimensions,
  selectedTileColor,
}: TileFloorLayoutProps) {
  const [mode, setMode] = useState<LayoutMode>("draw")
  const [paletteDragging, setPaletteDragging] = useState(false)
  const [placements, setPlacements] = useState<PlacedFloorItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = placements.find((p) => p.instanceId === selectedId) ?? null
  const selectedDef = selected ? getFloorPlanItemDef(selected.catalogItemId) : null

  const handleFurnitureDrop = useCallback(
    (detail: { catalogItemId: string; gridX: number; gridY: number }) => {
      const def = getFloorPlanItemDef(detail.catalogItemId)
      if (!def) return
      const { w, h } = effectiveFootprint(def.footprintW, def.footprintH, 0)
      const c = clampGridPosition(
        detail.gridX,
        detail.gridY,
        w,
        h,
        dimensions.width,
        dimensions.height,
      )
      const instance: PlacedFloorItem = {
        instanceId:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        catalogItemId: detail.catalogItemId,
        gridX: c.gridX,
        gridY: c.gridY,
        rotation: 0,
        flipH: false,
        flipV: false,
        snapped: true,
      }
      setPlacements((prev) => [...prev, instance])
      setSelectedId(instance.instanceId)
    },
    [dimensions.height, dimensions.width],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "furnish" || !selectedId) return
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        setPlacements((prev) => prev.filter((p) => p.instanceId !== selectedId))
        setSelectedId(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, selectedId])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={mode === "draw" ? "default" : "outline"}
          size="sm"
          className={
            mode === "draw"
              ? "rounded-lg bg-gradient-to-r from-red-600 to-red-500 font-semibold shadow-sm hover:from-red-700 hover:to-red-600"
              : "rounded-lg border-zinc-300 font-medium"
          }
          onClick={() => setMode("draw")}
        >
          Draw lines
        </Button>
        <Button
          type="button"
          variant={mode === "furnish" ? "default" : "outline"}
          size="sm"
          className={
            mode === "furnish"
              ? "rounded-lg bg-gradient-to-r from-red-600 to-red-500 font-semibold shadow-sm hover:from-red-700 hover:to-red-600"
              : "rounded-lg border-zinc-300 font-medium"
          }
          onClick={() => setMode("furnish")}
        >
          Furnish floor
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,380px)_1fr] lg:items-start">
        <FurniturePalette
          onPaletteDragChange={setPaletteDragging}
          disabled={mode !== "furnish"}
        />

        <div className="min-w-0 space-y-3">
          {mode === "furnish" && selected && selectedDef && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200/90 bg-gradient-to-r from-white to-zinc-50/80 p-2.5 shadow-sm ring-1 ring-zinc-900/5">
              <span className="mr-1 max-w-[10rem] truncate text-xs font-semibold text-zinc-800">
                {selectedDef.label}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() =>
                  setPlacements((prev) =>
                    prev.map((p) => {
                      if (p.instanceId !== selectedId) return p
                      const def = getFloorPlanItemDef(p.catalogItemId)
                      if (!def) return { ...p, rotation: nextRotation(p.rotation) }
                      const nextR = nextRotation(p.rotation)
                      const { w, h } = effectiveFootprint(
                        def.footprintW,
                        def.footprintH,
                        nextR,
                      )
                      const c = clampGridPosition(
                        p.gridX,
                        p.gridY,
                        w,
                        h,
                        dimensions.width,
                        dimensions.height,
                      )
                      return { ...p, rotation: nextR, gridX: c.gridX, gridY: c.gridY }
                    }),
                  )
                }
              >
                <RotateCw className="mr-1 h-3.5 w-3.5" />
                Rotate
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() =>
                  setPlacements((prev) =>
                    prev.map((p) =>
                      p.instanceId === selectedId ? { ...p, flipH: !p.flipH } : p,
                    ),
                  )
                }
              >
                <FlipHorizontal className="mr-1 h-3.5 w-3.5" />
                Flip H
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() =>
                  setPlacements((prev) =>
                    prev.map((p) =>
                      p.instanceId === selectedId ? { ...p, flipV: !p.flipV } : p,
                    ),
                  )
                }
              >
                <FlipVertical className="mr-1 h-3.5 w-3.5" />
                Flip V
              </Button>
              <Button
                type="button"
                variant={selected.snapped ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() =>
                  setPlacements((prev) =>
                    prev.map((p) =>
                      p.instanceId === selectedId ? { ...p, snapped: !p.snapped } : p,
                    ),
                  )
                }
              >
                <Magnet className="mr-1 h-3.5 w-3.5" />
                Snap to tiles
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-destructive hover:text-destructive"
                onClick={() => {
                  setPlacements((prev) =>
                    prev.filter((p) => p.instanceId !== selectedId),
                  )
                  setSelectedId(null)
                }}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          )}

          <DrawableGrid
            canvasRef={canvasRef}
            dimensions={dimensions}
            selectedTileColor={selectedTileColor}
            layoutMode={mode}
            paletteDragging={paletteDragging}
            onFurnitureDrop={handleFurnitureDrop}
            onFurnishClearSelection={() => setSelectedId(null)}
            renderFurniture={(metrics, floorRef) => (
              <PlacedItemsLayer
                metrics={metrics}
                floorRef={floorRef}
                items={placements}
                onItemsChange={setPlacements}
                selectedId={selectedId}
                onSelectId={setSelectedId}
                mode={mode}
              />
            )}
          />
        </div>
      </div>

      <section className="border-t border-zinc-200/80 pt-8">
        <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-900">
          3D layout
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600">
          Interactive preview with modeled fixtures, soft shadows, and the same tile texture as the
          grid. Drag to orbit, scroll to zoom (React Three Fiber + Three.js).
        </p>
        <FloorPlan3DPreview
          dimensions={dimensions}
          placements={placements}
          tileImagePath={getTileImagePath(selectedTileColor ?? "")}
        />
      </section>
    </div>
  )
}
