"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, FileText } from "lucide-react"
import Link from "next/link"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useEffect, useState } from "react"

export default function Hero() {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:py-20">
      {/* Animated gradient sweep */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0, 255, 153, 0.15), transparent)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Greeting */}
        <motion.div variants={fadeInUp} className="mb-4 sm:mb-6">
          <p className="font-mono text-base sm:text-lg text-muted-foreground">
            {"Hi, I'm "}
            <span className="crt text-xl sm:text-2xl font-bold text-neon-green">Pags</span>
            {showCursor && <span className="text-neon-magenta">_</span>}
          </p>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeInUp}
          className="mb-4 sm:mb-6 text-balance font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
        >
          {"Let's make things "}
          <span className="text-neon-cyan">faster</span> :)
        </motion.h1>

        {/* Description */}
        <motion.div
          variants={fadeInUp}
          className="mx-auto mb-6 sm:mb-8 max-w-2xl space-y-3 sm:space-y-4 text-pretty leading-relaxed px-4"
        >
          <p className="text-base sm:text-lg text-muted-foreground">
            I'm a Developer passionate about{" "}
            <span className="font-semibold text-neon-green">High Performance Computing</span> and{" "}
            <span className="font-semibold text-neon-green">Performance Engineering</span>. I'm also committed to
            advancing women's leadership in engineering and enjoy mentoring others in the field!
          </p>

          <div className="rounded-lg border border-neon-magenta/30 bg-card/50 p-3 sm:p-4 backdrop-blur-sm">
            <p className="font-mono text-xs sm:text-sm">
              <span className="text-neon-magenta">Fun fact:</span> When I'm not coding, you can usually find me curled
              up with a good fantasy book. Lately, I've been recommending{" "}
              <span className="italic text-neon-cyan">"The Left Hand of Darkness"</span> by Ursula K. Le Guin—it's a
              fantastic read!
            </p>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground">
            I'm actively seeking innovative tech opportunities and love connecting with people who share these
            interests. Say hi or let's build something!
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto group border-neon-cyan bg-neon-cyan/10 font-mono text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:glow-cyan"
          >
            <Link href="/work">
              <Briefcase className="mr-2 h-5 w-5" />
              View Work
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto group border-neon-magenta font-mono text-neon-magenta transition-all hover:bg-neon-magenta/10 hover:glow-magenta bg-transparent"
          >
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-5 w-5" />
              Open Resume
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
