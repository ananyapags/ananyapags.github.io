"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { blogPosts, type BlogPost } from "@/content/blog"
import JobCard from "./JobCard"
import { fadeInUp } from "@/lib/animations"

export default function JobTable() {
  const [expandedJob, setExpandedJob] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-neon-green/30 pb-2 font-mono text-sm text-neon-green">
        <div className="col-span-2">JOBID</div>
        <div className="col-span-4">NAME</div>
        <div className="col-span-3">STATUS</div>
        <div className="col-span-3">RUNTIME</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.jobId}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => setExpandedJob(expandedJob === post.jobId ? null : post.jobId)}
              className="w-full rounded-lg border border-border/40 bg-card/30 p-3 sm:p-4 text-left transition-all hover:border-neon-cyan/50 hover:bg-card/50 hover:glow-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-neon-cyan">{post.jobId}</span>
                  <StatusBadge status={post.status} />
                </div>
                <div className="font-mono text-sm text-foreground">{post.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{post.runtime}</div>
              </div>

              {/* Desktop layout */}
              <div className="hidden sm:grid grid-cols-12 gap-4 font-mono text-sm">
                <div className="col-span-2 text-neon-cyan">{post.jobId}</div>
                <div className="col-span-4 text-foreground">{post.name}</div>
                <div className="col-span-3">
                  <StatusBadge status={post.status} />
                </div>
                <div className="col-span-3 text-muted-foreground">{post.runtime}</div>
              </div>
            </button>

            <AnimatePresence>
              {expandedJob === post.jobId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <JobCard post={post} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: BlogPost["status"] }) {
  const styles = {
    COMPLETED: "border-neon-green text-neon-green",
    RUNNING: "border-neon-cyan text-neon-cyan animate-pulse",
    QUEUED: "border-neon-magenta text-neon-magenta",
  }

  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}
