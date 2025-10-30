"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
]

// external links removed per request

export default function Nav() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
      setMobileOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo/Home */}
        <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="group flex items-center gap-2">
          <span className="font-mono text-xl font-bold tracking-tight text-neon-green transition-all group-hover:glow-soft crt">
            PAGS
          </span>
          <span className="hidden sm:inline font-mono text-sm text-[var(--muted)]">⚡</span>
        </a>

        {/* Right: Navigation Links - Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Main nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-3 py-2 font-mono text-sm transition-colors hover:text-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-pink"
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan glow-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </div>

          {/* External links removed */}

          {/* Theme toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 border-neon-green/30 bg-[var(--surface-1)]/95 backdrop-blur-lg">
              <div className="flex flex-col gap-6 pt-8">
                {/* Main nav links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="rounded px-3 py-2 font-mono text-sm transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-pink"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* External links removed */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
