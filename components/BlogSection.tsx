"use client"

import { motion } from "framer-motion"
import JobTable from "./JobTable"
import { fadeInUp } from "@/lib/animations"

export default function BlogSection() {
  return (
    <section id="blog" className="relative min-h-screen px-4 py-16 sm:py-24">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="mb-8 sm:mb-12">
            <h2 className="mb-3 font-mono text-3xl sm:text-4xl font-bold text-neon-pink crt">Blog</h2>
            <p className="font-mono text-sm sm:text-base text-[var(--muted)]">$ squeue -u pags #click to expand </p>
          </div>

          {/* Job Table */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <JobTable />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
