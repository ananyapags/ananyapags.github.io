"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

const STORAGE_KEY = "theme"

function getPreferredTheme() {
  if (typeof window === "undefined") {
    return "dark"
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialTheme = getPreferredTheme()
    document.documentElement.dataset.theme = initialTheme
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }

  if (!mounted) {
    return <span className="block h-9 w-9 rounded-md" aria-hidden="true" />
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-all hover:bg-accent hover:text-accent-foreground hover:glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-5 w-5 text-neon-cyan" /> : <Moon className="h-5 w-5 text-neon-cyan" />}
    </button>
  )
}
