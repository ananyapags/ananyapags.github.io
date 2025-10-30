"use client"

export default function GridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(var(--grid-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  )
}
