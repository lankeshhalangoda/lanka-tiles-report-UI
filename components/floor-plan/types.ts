export type Rotation = 0 | 90 | 180 | 270

export function nextRotation(r: Rotation): Rotation {
  return ((r + 90) % 360) as Rotation
}

export interface GridMetrics {
  cellSize: { width: number; height: number }
  canvasSize: { width: number; height: number }
  dimensions: { width: number; height: number }
}

export interface FloorPlanItemDef {
  id: string
  label: string
  /** Lucide icon export name */
  icon: string
  footprintW: number
  footprintH: number
}

export interface FloorPlanCategoryDef {
  id: string
  label: string
  items: FloorPlanItemDef[]
}

export interface PlacedFloorItem {
  instanceId: string
  catalogItemId: string
  gridX: number
  gridY: number
  rotation: Rotation
  flipH: boolean
  flipV: boolean
  /** When true, moves snap to whole tile cells */
  snapped: boolean
}

export function effectiveFootprint(
  w: number,
  h: number,
  rotation: Rotation,
): { w: number; h: number } {
  if (rotation === 90 || rotation === 270) return { w: h, h: w }
  return { w, h }
}

export function clampGridPosition(
  gridX: number,
  gridY: number,
  occW: number,
  occH: number,
  dimW: number,
  dimH: number,
): { gridX: number; gridY: number } {
  return {
    gridX: Math.max(0, Math.min(gridX, dimW - occW)),
    gridY: Math.max(0, Math.min(gridY, dimH - occH)),
  }
}
