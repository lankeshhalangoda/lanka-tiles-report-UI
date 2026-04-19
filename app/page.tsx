"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { FormHeader } from "@/components/form-header"
import { CustomerForm } from "@/components/customer-form"
import { ProductCategoriesDrawer } from "@/components/product-categories-drawer"

export default function Home() {
  const router = useRouter()
  const [progress] = useState(33)
  const [selectedTileColor, setSelectedTileColor] = useState("")

  const handleNext = () => {
    // Pass the selected tile color to the grid page
    router.push(`/grid?tileColor=${selectedTileColor}`)
  }

  return (
    <main className="min-h-screen pb-36">
      <FormHeader />
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-8 pt-3 lg:max-w-7xl">
      <Card className="mb-0">
        <CardContent className="p-5 pt-7 sm:p-6 sm:pt-8">
          <h2 className="font-display mb-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Customer information
          </h2>
          <p className="mb-6 text-sm text-zinc-600">
            Capture customer and site details before laying out tiles.
          </p>
          <CustomerForm onTileColorChange={setSelectedTileColor} />
        </CardContent>
      </Card>

      <ProductCategoriesDrawer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 bg-white/90 p-4 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 lg:max-w-7xl">
          <Progress value={progress} className="mb-4 h-2 bg-zinc-100" />
          <Button
            onClick={handleNext}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-base font-semibold shadow-lg shadow-red-500/25 transition hover:from-red-700 hover:to-red-600"
          >
            Next: Tile layout
          </Button>
        </div>
      </div>
    </main>
  )
}
