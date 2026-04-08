import JobTable from "./JobTable"

export default function BlogSection() {
  return (
    <section id="blog" className="relative min-h-screen scroll-mt-24 px-4 py-16 sm:py-24">
      <div className="container mx-auto max-w-5xl">
        <div>
          {/* Section Header */}
          <div className="mb-8 sm:mb-12">
            <h2 className="mb-3 font-mono text-3xl sm:text-4xl font-bold text-neon-pink crt">Blog</h2>
            <p className="font-mono text-sm sm:text-base text-[var(--muted)]">$ squeue -u pags #click to expand </p>
          </div>

          {/* Job Table */}
          <JobTable />
        </div>
      </div>
    </section>
  )
}
