import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ProductCategoriesProvider } from "@/components/product-categories-provider"
import { APP_META_DESCRIPTION, APP_PRODUCT_NAME } from "@/lib/branding"

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${APP_PRODUCT_NAME} — Lanka Tiles`,
    template: `%s — ${APP_PRODUCT_NAME}`,
  },
  description: APP_META_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <ProductCategoriesProvider>
          {children}
          <Toaster />
        </ProductCategoriesProvider>
      </body>
    </html>
  )
}
