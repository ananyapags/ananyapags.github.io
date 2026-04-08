import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"
import { getBlogPostMeta } from "./index"

export interface FullBlogPost {
  jobId: number
  name: string
  slug: string
  status: "COMPLETED" | "RUNNING" | "QUEUED"
  runtime: string
  stack: string[]
  benchmarks: {
    label: string
    value: string
  }[]
  summary: string
  content: string
}

export async function getBlogPost(slug: string): Promise<FullBlogPost | undefined> {
  const meta = getBlogPostMeta(slug)
  if (!meta) {
    return undefined
  }

  const contentPath = path.join(process.cwd(), "content", "blog", "posts", `${slug}.md`)
  const content = await readFile(contentPath, "utf8")

  return {
    ...meta,
    content,
  }
}
