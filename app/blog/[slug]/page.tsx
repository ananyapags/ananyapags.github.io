import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { blogPosts, getBlogPostMeta } from "@/content/blog"
import { getBlogPost } from "@/content/blog/server"

type PageProps = {
  params: Promise<{ slug: string }>
}

function stripMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
}

export async function generateStaticParams() {
  return blogPosts
    .filter((post) => post.status !== "QUEUED")
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostMeta(slug)
  if (!post) return { title: "Post not found" }
  return {
    title: post.name,
    description: stripMarkdownLinks(post.summary),
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      <Nav />
      <section className="relative px-4 py-12 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="min-w-0 space-y-3">
              <h1 className="max-w-full break-words font-mono text-2xl font-bold leading-tight text-neon-green crt sm:text-4xl">
                {post.name}
              </h1>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p className="break-words text-sm text-foreground/80 sm:text-base" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-neon-cyan underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                }}
              >
                {post.summary}
              </ReactMarkdown>
              <p className="font-mono text-sm text-[var(--muted)]">Runtime: {post.runtime}</p>
              <div className="flex flex-wrap gap-2">
                {post.stack.map((tech) => (
                  <span key={tech} className="rounded border border-neon-cyan/30 bg-[var(--surface-1)]/50 px-2 py-1 font-mono text-xs text-neon-cyan">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <article className="min-w-0 max-w-none font-sans">
              <div className="space-y-5 text-[15px] leading-7 sm:text-[17px]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="mt-0 mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="mt-10 mb-4 border-b border-border/60 pb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="mt-7 mb-3 text-lg font-semibold text-neon-cyan sm:text-xl" {...props} />
                    ),
                    p: ({ node, ...props }) => <p className="my-0 break-words text-foreground/90" {...props} />,
                    ul: ({ node, ...props }) => <ul className="my-4 list-disc space-y-2 pl-6 marker:text-neon-cyan" {...props} />,
                    ol: ({ node, ...props }) => <ol className="my-4 list-decimal space-y-2 pl-6 marker:text-neon-cyan" {...props} />,
                    li: ({ node, ...props }) => <li className="text-foreground/90" {...props} />,
                    hr: () => <hr className="my-8 border-[var(--border)]" />,
                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                    a: ({ node, ...props }) => (
                      <a className="text-neon-cyan underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="my-6 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-3 text-foreground/90 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        className="my-6 overflow-x-auto rounded-xl border border-border/70 bg-[var(--surface-1)] px-3 py-4 text-sm leading-6 shadow-sm"
                        {...props}
                      />
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const isBlock = Boolean(className)
                      if (isBlock) {
                        return (
                          <code className={`${className} block whitespace-pre-wrap p-0 font-mono text-[13px] sm:text-sm`} {...props}>
                            {children}
                          </code>
                        )
                      }

                      return (
                        <code
                          className="break-words rounded bg-[var(--surface-1)] px-1.5 py-0.5 font-mono text-[0.9em] text-neon-cyan"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    table: ({ node, ...props }) => (
                      <div className="my-6 overflow-hidden rounded-2xl border border-border/60 bg-[var(--surface-1)]/45 shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
                        <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
                          <table className="w-full min-w-[540px] border-collapse text-left text-xs sm:min-w-[720px] sm:text-base" {...props} />
                        </div>
                      </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-[var(--surface-1)]/90 backdrop-blur-sm" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="[&_tr:nth-child(even)]:bg-white/[0.025] [&_p]:my-0" {...props} />,
                    th: ({ node, ...props }) => (
                      <th
                        className="border-b border-border/60 px-3 py-2.5 align-top font-mono text-[10px] uppercase tracking-[0.14em] text-neon-green sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.18em]"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border-b border-border/40 px-3 py-3 align-top leading-6 break-words text-foreground/90 sm:px-5 sm:py-4 sm:leading-7" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </article>

          <div className="pt-2">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto group border-neon-cyan font-mono text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:glow-soft bg-transparent focus:ring-2 focus:ring-neon-cyan"
            >
              <Link href="/#blog" scroll>
                ← Back to Blog
              </Link>
            </Button>
          </div>
          </div>
        </div>
      </section>
    </>
  )
}
