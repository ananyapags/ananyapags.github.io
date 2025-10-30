"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Mail, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useEffect, useState } from "react"

export default function HomeSection() {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:py-20"
    >
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
          <h1 className="font-mono text-xl sm:text-2xl md:text-3xl text-balance">
            {"Hi 👋, I'm "}
            <span className="crt text-2xl sm:text-3xl md:text-4xl font-bold text-neon-green">Pags </span>
            {" — Let's make things "}
            <span className="text-neon-cyan font-bold">faster ⚡️</span>
            {" :)"}
            {showCursor && <span className="text-neon-pink">_</span>}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={fadeInUp}
          className="mx-auto mb-6 sm:mb-8 max-w-2xl space-y-3 sm:space-y-4 text-pretty leading-relaxed px-4"
        >
          <p className="text-base sm:text-lg text-[var(--muted)]">
            Developer passionate about{" "}
            <span className="font-semibold text-neon-green">High Performance Computing</span> and{" "}
            <span className="font-semibold text-neon-green">Performance Engineering</span>. I'm also committed to
            advancing women's leadership in engineering and enjoy mentoring others in the field!
          </p>

          <div className="rounded-lg border border-neon-pink/30 bg-[var(--surface-1)]/50 p-3 sm:p-4 backdrop-blur-sm">
            <p className="font-mono text-xs sm:text-sm">
              <span className="text-neon-pink">Fun fact:</span> When I'm not coding, you can usually find me curled up
              with a good fantasy book. Lately, I've been recommending{" "}
              <span className="italic text-neon-cyan">"The Left Hand of Darkness"</span> by Ursula K. Le Guin—it's a
              fantastic read!
            </p>
          </div>

          <p className="text-base sm:text-lg text-[var(--muted)]">
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
            variant="outline"
            className="w-full sm:w-auto group border-neon-cyan font-mono text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:glow-soft bg-transparent focus:ring-2 focus:ring-neon-cyan"
          >
            <a href="mailto:ananyapag@gmail.com">
              <Mail className="mr-2 h-5 w-5" />
              Email Me
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto group border-neon-green font-mono text-neon-green transition-all hover:bg-neon-green/10 hover:glow-soft bg-transparent focus:ring-2 focus:ring-neon-green"
          >
            <a href="https://github.com/ananyapags" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto group border-neon-pink font-mono text-neon-pink transition-all hover:bg-neon-pink/10 hover:glow-soft bg-transparent focus:ring-2 focus:ring-neon-pink"
          >
            <a href="https://www.linkedin.com/in/ananyapg/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
