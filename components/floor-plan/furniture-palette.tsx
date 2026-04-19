"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FloorPlanItemIcon } from "./item-icon"
import { FLOOR_PLAN_CATEGORIES } from "./catalog"
import { cn } from "@/lib/utils"

const MIME = "application/x-lanka-floor-item"

export function setFloorDragPayload(e: React.DragEvent, catalogItemId: string) {
  e.dataTransfer.setData(MIME, catalogItemId)
  e.dataTransfer.effectAllowed = "copy"
}

export function readFloorDragPayload(e: React.DragEvent): string | null {
  return e.dataTransfer.getData(MIME) || null
}

interface FurniturePaletteProps {
  onPaletteDragChange: (dragging: boolean) => void
  disabled?: boolean
}

export function FurniturePalette({
  onPaletteDragChange,
  disabled,
}: FurniturePaletteProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50/90 p-3 shadow-sm ring-1 ring-zinc-900/5",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <p className="mb-2 px-1 text-xs font-medium text-zinc-600">
        Drag an item onto the floor plan (Furnish mode).
      </p>
      <Accordion type="multiple" className="w-full">
        {FLOOR_PLAN_CATEGORIES.map((cat) => (
          <AccordionItem value={cat.id} key={cat.id}>
            <AccordionTrigger className="py-2 text-sm">{cat.label}</AccordionTrigger>
            <AccordionContent>
              <ul className="grid grid-cols-2 gap-2 pb-1">
                {cat.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        onPaletteDragChange(true)
                        setFloorDragPayload(e, item.id)

                        const ghost = document.createElement("div")
                        ghost.textContent = item.label
                        ghost.style.cssText = [
                          "position:fixed",
                          "left:-10000px",
                          "top:0",
                          "padding:10px 14px",
                          "font-size:13px",
                          "font-weight:600",
                          "font-family:system-ui,-apple-system,sans-serif",
                          "color:#231f20",
                          "background:#fff",
                          "border:1px solid #d4d4d8",
                          "border-radius:10px",
                          "box-shadow:0 6px 20px rgba(0,0,0,.12)",
                          "pointer-events:none",
                          "z-index:2147483647",
                          "white-space:nowrap",
                          "max-width:240px",
                        ].join(";")
                        document.body.appendChild(ghost)
                        void ghost.offsetWidth
                        const el = e.currentTarget as HTMLButtonElement & {
                          _floorDragGhost?: HTMLDivElement
                        }
                        el._floorDragGhost = ghost
                        requestAnimationFrame(() => {
                          e.dataTransfer.setDragImage(
                            ghost,
                            Math.round(ghost.offsetWidth / 2),
                            Math.round(ghost.offsetHeight / 2),
                          )
                        })
                      }}
                      onDragEnd={(e) => {
                        const el = e.currentTarget as HTMLButtonElement & {
                          _floorDragGhost?: HTMLDivElement
                        }
                        el._floorDragGhost?.remove()
                        el._floorDragGhost = undefined
                        onPaletteDragChange(false)
                      }}
                      className="flex w-full flex-col items-center gap-1 rounded-lg border border-zinc-200/90 bg-white px-2 py-2.5 text-center text-xs font-semibold text-zinc-800 shadow-sm transition hover:border-red-300/60 hover:bg-gradient-to-b hover:from-red-50/80 hover:to-white active:scale-[0.98]"
                    >
                      <FloorPlanItemIcon icon={item.icon} size={22} />
                      <span className="leading-tight">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
