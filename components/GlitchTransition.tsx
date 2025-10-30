"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function GlitchTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 450)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none fixed inset-0 z-50"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              mixBlendMode: "multiply",
            }}
          >
            <motion.div
              animate={{
                x: [-2, 2, -2, 2, 0],
                y: [2, -2, 2, -2, 0],
              }}
              transition={{ duration: 0.12, times: [0, 0.25, 0.5, 0.75, 1] }}
              className="h-full w-full"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(255,0,0,0.1) 0px, transparent 2px, rgba(0,255,0,0.1) 4px, transparent 6px, rgba(0,0,255,0.1) 8px, transparent 10px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  )
}
