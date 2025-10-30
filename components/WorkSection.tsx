"use client"

import { motion } from "framer-motion"
import TerminalFeed from "./TerminalFeed"

export default function WorkSection() {
  return (
    <section id="work" className="relative min-h-screen px-4 py-16 sm:py-24">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="mb-8 sm:mb-12">
            <h2 className="mb-3 font-mono text-3xl sm:text-4xl font-bold text-neon-cyan crt">Work</h2>
            <p className="font-mono text-sm sm:text-base text-[var(--muted)]">Recent projects and contributions. Click to expand.</p>
          </div>

          {/* Terminal Feed */}
          <TerminalFeed />
        </motion.div>
      </div>
    </section>
  )
}
