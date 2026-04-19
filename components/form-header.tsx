"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { StatusDropdown } from "@/components/status-dropdown"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Customer", path: "/" },
  { id: 2, name: "Tile layout", path: "/grid" },
  { id: 3, name: "Items", path: "/items" },
] as const

export function FormHeader() {
  const pathname = usePathname()
  const currentStep =
    pathname.startsWith("/items") ? 3 : pathname.startsWith("/grid") ? 2 : 1

  return (
    <header
      className={cn(
        "sticky top-0 z-50 -mx-4 border-b border-zinc-200/80",
        "bg-gradient-to-b from-white/95 via-white/90 to-zinc-50/85",
        "px-4 py-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)]",
        "backdrop-blur-xl supports-[backdrop-filter]:bg-white/70",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/lanka-tiles-logo.png"
              alt="Lanka Tiles"
              width={168}
              height={42}
              className="h-9 w-auto shrink-0 drop-shadow-sm"
              priority
            />
            <span
              className="hidden min-[380px]:block h-9 w-px shrink-0 self-center bg-zinc-200"
              aria-hidden
            />
            <div className="hidden min-[380px]:block text-left">
              <p className="font-display text-lg font-semibold leading-tight tracking-tight text-zinc-900">
                Site report
              </p>
              <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                Lanka Tiles
              </p>
            </div>
          </Link>
          <StatusDropdown className="mb-0 mt-0 shrink-0" />
        </div>

        <nav aria-label="Progress" className="w-full">
          <ol className="flex items-center gap-1.5">
            {steps.map((step, index) => {
              const active = step.id === currentStep
              const done = step.id < currentStep
              return (
                <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1.5">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-px flex-1 rounded-full",
                        done ? "bg-gradient-to-r from-red-500 to-red-400" : "bg-zinc-200",
                      )}
                      aria-hidden
                    />
                  )}
                  <div
                    className={cn(
                      "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-center transition-colors",
                      active &&
                        "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md shadow-red-500/25",
                      done && !active && "text-red-600",
                      !active && !done && "text-zinc-500",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        active && "bg-white/20 text-white",
                        done && !active && "bg-red-50 text-red-600 ring-1 ring-red-200",
                        !active && !done && "bg-zinc-100 text-zinc-500",
                      )}
                    >
                      {done ? "✓" : step.id}
                    </span>
                    <span
                      className={cn(
                        "truncate text-[10px] font-semibold uppercase tracking-wide",
                        active ? "text-white/95" : "text-zinc-600",
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </header>
  )
}
