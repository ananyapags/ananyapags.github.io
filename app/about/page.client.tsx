"use client"

import { } from "react"
import { motion } from "framer-motion"
import Nav from "@/components/Nav"
import GlitchTransition from "@/components/GlitchTransition"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer } from "@/lib/animations"

export default function AboutPageClient() {
  

  return (
    <GlitchTransition>
      <Nav />
      <main className="relative min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-20">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-12">
            {/* Header */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="font-mono text-4xl font-bold text-neon-green md:text-5xl">About</h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                System specifications and diagnostics for Pag's performance engineering profile.
              </p>
            </motion.div>

            {/* Spec Block */}
            <div className="space-y-4">
              <motion.h2 variants={fadeInUp} className="font-mono text-2xl font-semibold text-neon-cyan">
                System Specs
              </motion.h2>

            </div>

            
          </motion.div>
        </div>
      </main>

      
    </GlitchTransition>
  )
}
