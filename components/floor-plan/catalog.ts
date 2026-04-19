import type { FloorPlanCategoryDef, FloorPlanItemDef } from "./types"

export const FLOOR_PLAN_CATEGORIES: FloorPlanCategoryDef[] = [
  {
    id: "bath",
    label: "Bath",
    items: [
      { id: "bath-tub", label: "Bathtub", icon: "Bath", footprintW: 2, footprintH: 1 },
      { id: "bath-toilet", label: "Toilet", icon: "Circle", footprintW: 1, footprintH: 1 },
      { id: "bath-sink", label: "Sink", icon: "Droplets", footprintW: 1, footprintH: 1 },
      { id: "bath-shower", label: "Shower", icon: "ShowerHead", footprintW: 1, footprintH: 2 },
      { id: "bath-vanity", label: "Vanity", icon: "Square", footprintW: 2, footprintH: 1 },
    ],
  },
  {
    id: "living",
    label: "Living area",
    items: [
      { id: "living-sofa", label: "Sofa", icon: "Sofa", footprintW: 2, footprintH: 1 },
      { id: "living-tv", label: "TV unit", icon: "Tv", footprintW: 2, footprintH: 1 },
      { id: "living-coffee", label: "Coffee table", icon: "Table", footprintW: 1, footprintH: 1 },
      { id: "living-armchair", label: "Armchair", icon: "Armchair", footprintW: 1, footprintH: 1 },
      { id: "living-lamp", label: "Floor lamp", icon: "LampFloor", footprintW: 1, footprintH: 1 },
    ],
  },
  {
    id: "dining",
    label: "Dining",
    items: [
      { id: "dining-table", label: "Dining table", icon: "Table", footprintW: 2, footprintH: 2 },
      { id: "dining-chair", label: "Chair", icon: "Armchair", footprintW: 1, footprintH: 1 },
      { id: "dining-sideboard", label: "Sideboard", icon: "Boxes", footprintW: 2, footprintH: 1 },
      { id: "dining-barstool", label: "Bar stool", icon: "Circle", footprintW: 1, footprintH: 1 },
      { id: "dining-cabinet", label: "Display cabinet", icon: "DoorOpen", footprintW: 1, footprintH: 2 },
    ],
  },
  {
    id: "bedroom",
    label: "Bedroom",
    items: [
      { id: "bed-room-bed", label: "Bed", icon: "BedDouble", footprintW: 2, footprintH: 2 },
      { id: "bed-room-wardrobe", label: "Wardrobe", icon: "Boxes", footprintW: 2, footprintH: 1 },
      { id: "bed-room-night", label: "Nightstand", icon: "Square", footprintW: 1, footprintH: 1 },
      { id: "bed-room-desk", label: "Desk", icon: "Table", footprintW: 2, footprintH: 1 },
      { id: "bed-room-lamp", label: "Bedside lamp", icon: "Lamp", footprintW: 1, footprintH: 1 },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    items: [
      { id: "kit-fridge", label: "Refrigerator", icon: "Refrigerator", footprintW: 1, footprintH: 2 },
      { id: "kit-stove", label: "Cooktop", icon: "ChefHat", footprintW: 2, footprintH: 1 },
      { id: "kit-island", label: "Island", icon: "Table", footprintW: 2, footprintH: 1 },
      { id: "kit-mwave", label: "Microwave", icon: "Microwave", footprintW: 1, footprintH: 1 },
      { id: "kit-hood", label: "Hood / fan", icon: "Wind", footprintW: 1, footprintH: 1 },
    ],
  },
]

const itemMap = new Map<string, FloorPlanItemDef>()
for (const cat of FLOOR_PLAN_CATEGORIES) {
  for (const item of cat.items) {
    itemMap.set(item.id, item)
  }
}

export function getFloorPlanItemDef(catalogItemId: string) {
  return itemMap.get(catalogItemId)
}
