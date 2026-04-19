"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { FormHeader } from "@/components/form-header"
import { TileFloorLayout } from "@/components/tile-floor-layout"
import { TileDimensions } from "@/components/tile-dimensions"
import { ProductCategoriesDrawer } from "@/components/product-categories-drawer"
import { useSearchParams } from "next/navigation"

export default function GridPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [progress] = useState(66)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 5, height: 5 })

  const selectedTileColor = searchParams.get("tileColor") || ""

  const handleNext = () => {
    router.push("/items")
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <main className="min-h-screen pb-40">
      <FormHeader />
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-8 pt-3 lg:max-w-7xl">
        <Card>
          <CardContent className="p-5 pt-7 sm:p-6 sm:pt-8">
            <h2 className="font-display mb-1 text-2xl font-semibold tracking-tight text-zinc-900">
              Tile layout
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-600">
              Set tile dimensions, sketch lines on the grid, then switch to{" "}
              <span className="font-medium text-zinc-800">Furnish floor</span> to drag fixtures onto
              your plan. Use the 3D preview below to review the space. Selected pieces can rotate,
              flip, snap to tiles, or be removed.
            </p>

            <TileDimensions dimensions={dimensions} setDimensions={setDimensions} />

            <TileFloorLayout
              canvasRef={canvasRef}
              dimensions={dimensions}
              selectedTileColor={selectedTileColor}
            />
          </CardContent>
        </Card>

        <ProductCategoriesDrawer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 bg-white/90 p-4 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 lg:max-w-7xl">
          <Progress value={progress} className="mb-4 h-2 bg-zinc-100" />
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleBack}
              variant="outline"
              className="h-11 rounded-xl border-zinc-300 bg-white/80 font-semibold"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-red-500 font-semibold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-red-600"
            >
              Next: Items
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
