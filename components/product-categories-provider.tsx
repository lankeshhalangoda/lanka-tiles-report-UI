"use client"

import {
  createContext,
  useState,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

export type ProductCategorySelection = {
  floorTiles: boolean
  wallTiles: boolean
  mosaicTiles: boolean
  sanitaryWare: boolean
  faucets: boolean
  accessories: boolean
  tileMortar: boolean
  grout: boolean
  groutSealers: boolean
  spacers: boolean
  silicon: boolean
  skimCoat: boolean
  waterProofer: boolean
  paint: boolean
  cleaners: boolean
  pebbles: boolean
  aluminiumDoors: boolean
  windows: boolean
  skirting: boolean
  beading: boolean
  ladders: boolean
}

const defaultSelection: ProductCategorySelection = {
  floorTiles: true,
  wallTiles: true,
  mosaicTiles: true,
  sanitaryWare: false,
  faucets: false,
  accessories: false,
  tileMortar: true,
  grout: true,
  groutSealers: true,
  spacers: true,
  silicon: false,
  skimCoat: false,
  waterProofer: false,
  paint: false,
  cleaners: true,
  pebbles: false,
  aluminiumDoors: false,
  windows: false,
  skirting: false,
  beading: false,
  ladders: false,
}

interface ProductCategoriesContextType {
  selectedItems: ProductCategorySelection
  setSelectedItems: Dispatch<SetStateAction<ProductCategorySelection>>
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

const ProductCategoriesContext = createContext<ProductCategoriesContextType | undefined>(undefined)

export function ProductCategoriesProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] =
    useState<ProductCategorySelection>(defaultSelection)

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <ProductCategoriesContext.Provider value={{ selectedItems, setSelectedItems, drawerOpen, setDrawerOpen }}>
      {children}
    </ProductCategoriesContext.Provider>
  )
}

export function useProductCategories() {
  const context = useContext(ProductCategoriesContext)
  if (context === undefined) {
    throw new Error("useProductCategories must be used within a ProductCategoriesProvider")
  }
  return context
}
