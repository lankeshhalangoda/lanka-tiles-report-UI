"use client"

import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

const FALLBACK: LucideIcon = Icons.Home

function resolveIcon(name: string): LucideIcon {
  const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[name]
  return Icon ?? FALLBACK
}

export function FloorPlanItemIcon({
  icon,
  className,
  size = 20,
}: {
  icon: string
  className?: string
  size?: number
}) {
  const Icon = resolveIcon(icon)
  return <Icon className={className} size={size} aria-hidden />
}
