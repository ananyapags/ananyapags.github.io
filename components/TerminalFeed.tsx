"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import NeonBadge from "./NeonBadge"
import { projects, type Project } from "@/content/projects"

export default function TerminalFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!isPlaying || currentIndex >= projects.length) return

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, projects.length))
    }, 800)

    return () => clearTimeout(timer)
  }, [currentIndex, isPlaying])

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <div className="space-y-4">
      {/* Terminal Header */}
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-neon-green/30 bg-card/50 px-3 sm:px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neon-green">
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
          <span className="hidden sm:inline">terminal@pags:~/projects</span>
          <span className="sm:hidden">~/projects</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-7 font-mono text-xs text-neon-cyan hover:glow-cyan"
          aria-label={isPlaying ? "Pause feed" : "Play feed"}
        >
          {isPlaying ? <Pause className="mr-1 h-3 w-3" /> : <Play className="mr-1 h-3 w-3" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>

      {/* Terminal Content */}
      <div className="min-h-[400px] rounded-b-lg border border-neon-green/30 bg-card/50 dark:bg-black/80 p-3 sm:p-4 font-mono text-xs sm:text-sm backdrop-blur-sm">
        <div className="space-y-3">
          {projects.slice(0, currentIndex).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                className="w-full text-left transition-all hover:bg-neon-green/5 focus:outline-none focus:ring-1 focus:ring-neon-cyan"
              >
                {/* Mobile layout */}
                <div className="flex flex-col gap-1 rounded p-2 sm:hidden">
                  <div className="flex items-center gap-2">
                    {project.emoji && <span>{project.emoji}</span>}
                    <span className="text-neon-cyan">Log:</span>
                  </div>
                  <span className="text-foreground">{project.title}</span>
                  <span className="text-xs text-muted-foreground">[{formatTimestamp(project.timestamp)}]</span>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:flex items-start gap-2 rounded p-2">
                  <span className="text-muted-foreground">[{formatTimestamp(project.timestamp)}]</span>
                  {project.emoji && <span>{project.emoji}</span>}
                  <span className="text-neon-cyan"> \\Log:</span>
                  <span className="flex-1 text-foreground">{project.title}</span>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ProjectDetail project={project} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {currentIndex < projects.length && isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-neon-cyan"
            >
              <span className="animate-pulse">▋</span>
              <span>Loading next entry...</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="ml-2 sm:ml-4 mt-2 space-y-4 rounded-lg border border-neon-cyan/30 bg-card/50 p-3 sm:p-4 backdrop-blur-sm">
      {/* Summary */}
      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{project.summary}</p>

      {/* Details */}
      <div className="space-y-3">
        <DetailSection title="Problem" content={project.details.problem} color="magenta" />
        <DetailSection title="Approach" content={project.details.approach} color="cyan" />
        <DetailSection title="Result" content={project.details.result} color="green" />
      </div>

      {/* Stack */}
      <div className="space-y-2">
        <p className="font-mono text-xs text-neon-cyan">Stack:</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <NeonBadge key={tech} variant="green">
              {tech}
            </NeonBadge>
          ))}
        </div>
      </div>

      {/* Links */}
      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.links.map((link) => (
            <Button
              key={link.label}
              asChild
              size="sm"
              variant="outline"
              className="border-neon-magenta font-mono text-xs sm:text-sm text-neon-magenta hover:bg-neon-magenta/10 hover:glow-magenta bg-transparent"
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailSection({
  title,
  content,
  color,
}: {
  title: string
  content: string
  color: "green" | "cyan" | "magenta"
}) {
  const colorClasses = {
    green: "text-neon-green",
    cyan: "text-neon-cyan",
    magenta: "text-neon-magenta",
  }

  return (
    <div className="space-y-1">
      <p className={`font-mono text-xs font-semibold ${colorClasses[color]}`}>{title}:</p>
      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{content}</p>
    </div>
  )
}
