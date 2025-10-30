"use client"

import { useEffect, useState } from "react"

export default function ScanlineOverlay() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  if (reducedMotion) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          var(--scanline) 2px,
          var(--scanline) 4px
        )`,
        mixBlendMode: "soft-light",
        animation: "scanline-move 8s linear infinite",
      }}
      aria-hidden="true"
    />
  )
}
