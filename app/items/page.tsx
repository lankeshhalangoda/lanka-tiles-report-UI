"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { FormHeader } from "@/components/form-header"
import { ItemsList } from "@/components/items-list"
import { SignaturePad } from "@/components/signature-pad"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { ProductCategoriesDrawer } from "@/components/product-categories-drawer"
import { Plus } from "lucide-react"

export default function ItemsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [progress] = useState(100)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [items, setItems] = useState([
    {
      id: 1,
      code: "FAM-LGY-7082A",
      size: "45",
      quantity: 5,
      discount: 20,
      price: 1500,
      area: "Living Room",
      storeLocation: "Colombo",
    },
  ])

  const [potentialValue, setPotentialValue] = useState("")

  // Calculate grand total
  const grandTotal = items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity * (1 - item.discount / 100)
    return total + itemTotal
  }, 0)

  const handleBack = () => {
    router.push("/grid")
  }

  const handleSubmit = () => {
    if (!termsAgreed) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Report Submitted",
      description: "Your report has been successfully submitted!",
      className: "bg-[#231f20] text-white border-[#231f20]",
    })

    // Redirect to home page after 2 seconds
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <main className="min-h-screen pb-40">
      <FormHeader />
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-8 pt-3 lg:max-w-7xl">
      <Card>
        <CardContent className="p-5 pt-7 sm:p-6 sm:pt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
                Items
              </h2>
              <p className="mt-1 text-sm text-zinc-600">Line items and pricing</p>
            </div>
            <Button
              className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 font-semibold shadow-sm hover:from-red-700 hover:to-red-600"
              size="sm"
              onClick={() => {
                const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
                setItems([
                  ...items,
                  {
                    id: newId,
                    code: "",
                    size: "",
                    quantity: 0,
                    discount: 0,
                    price: 0,
                    area: "",
                    storeLocation: "",
                  },
                ])
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>

          <ItemsList items={items} setItems={setItems} />

          <div className="grid gap-4 mt-6">
            <div className="space-y-1">
              <Label htmlFor="potentialValue" className="text-sm">
                Potential Requirement Value
              </Label>
              <Input
                id="potentialValue"
                value={potentialValue}
                onChange={(e) => setPotentialValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="grandTotal" className="text-sm">
                Grand Total
              </Label>
              <Input id="grandTotal" value={grandTotal.toFixed(2)} readOnly className="bg-gray-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 pt-7 sm:p-6 sm:pt-8">
          <h2 className="font-display mb-4 text-2xl font-semibold tracking-tight text-zinc-900">
            Signatures
          </h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">CCA&apos;s Signature</h3>
            <SignaturePad label="CCA's Signature" />
          </div>

          <div>
            <h3 className="font-medium mb-2">Customer&apos;s Signature</h3>
            <SignaturePad label="Customer's Signature" />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="terms"
              checked={termsAgreed}
              onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the terms and conditions
            </Label>
          </div>
        </CardContent>
      </Card>

      <ProductCategoriesDrawer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 bg-white/90 p-4 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 lg:max-w-7xl">
          <Progress value={progress} className="mb-4 h-2 bg-zinc-100" />
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleBack} variant="outline" className="h-11 rounded-xl font-semibold">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-red-500 font-semibold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-red-600"
            >
              Submit report
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
