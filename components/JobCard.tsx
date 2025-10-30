import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight } from "lucide-react"
import NeonBadge from "./NeonBadge"
import type { BlogPost } from "@/content/blog"

interface JobCardProps {
  post: BlogPost
}

export default function JobCard({ post }: JobCardProps) {
  return (
    <div className="mt-2 rounded-lg border border-neon-cyan/30 bg-card/50 p-6 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Summary */}
        <p className="text-sm leading-relaxed text-muted-foreground">{post.summary}</p>

        {/* Stack */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-neon-cyan">Stack:</p>
          <div className="flex flex-wrap gap-2">
            {post.stack.map((tech) => (
              <NeonBadge key={tech} variant="cyan">
                {tech}
              </NeonBadge>
            ))}
          </div>
        </div>

        {/* Benchmarks */}
        {post.benchmarks.length > 0 && (
          <div className="space-y-2">
            <p className="font-mono text-xs text-neon-magenta">Key Metrics:</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {post.benchmarks.map((benchmark) => (
                <div key={benchmark.label} className="rounded border border-border/40 bg-muted/20 p-2">
                  <p className="text-xs text-muted-foreground">{benchmark.label}</p>
                  <p className="font-mono text-sm font-semibold text-neon-green">{benchmark.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Logs Button */}
        <Button
          asChild
          className="group w-full border-neon-green bg-neon-green/10 font-mono text-neon-green hover:bg-neon-green/20 hover:glow-green sm:w-auto"
        >
          <Link href={`/blog/${post.slug}`}>
            <FileText className="mr-2 h-4 w-4" />
            View Post
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
