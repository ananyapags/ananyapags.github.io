"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  { href: "#blog", label: "Blog" },
  { href: "#work", label: "Work" },
]

// external links removed per request

export default function Nav() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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
    if (pathname !== "/") {
      e.preventDefault()
      router.push(`/${href}`)
      setMobileOpen(false)
      return
    }

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
        <a href={pathname === "/" ? "#home" : "/#home"} onClick={(e) => handleNavClick(e, "#home")} className="group flex items-center gap-2">
          <span className="font-mono text-xl font-bold tracking-tight text-neon-green transition-all group-hover:glow-soft crt">
            PAGS
          </span>
          <span className="hidden h-5 w-5 items-center justify-center text-base leading-none text-[var(--muted)] sm:inline-flex">
            ⚡
          </span>
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
                  href={pathname === "/" ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-3 py-2 font-mono text-sm transition-colors hover:text-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-pink"
                >
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan glow-soft" />}
                </a>
              )
            })}
          </div>

          {/* External links removed */}

          {/* Theme toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="relative flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {mobileOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-neon-green/30 bg-[var(--surface-1)]/95 p-4 backdrop-blur-lg">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={pathname === "/" ? link.href : `/${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="rounded px-3 py-2 font-mono text-sm transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
