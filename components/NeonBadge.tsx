import type React from "react"
import { cn } from "@/lib/utils"

interface NeonBadgeProps {
  children: React.ReactNode
  variant?: "green" | "magenta" | "cyan"
  className?: string
}

export default function NeonBadge({ children, variant = "green", className }: NeonBadgeProps) {
  const variantStyles = {
    green: "border-neon-green text-neon-green hover:glow-green",
    magenta: "border-neon-magenta text-neon-magenta hover:glow-magenta",
    cyan: "border-neon-cyan text-neon-cyan hover:glow-cyan",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-xs font-semibold transition-all",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
