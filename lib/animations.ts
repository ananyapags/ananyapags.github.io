"use client"

import type { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const glitchVariants: Variants = {
  initial: { x: 0, y: 0 },
  animate: {
    x: [-2, 2, -2, 2, 0],
    y: [2, -2, 2, -2, 0],
    transition: {
      duration: 0.3,
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  },
}

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
