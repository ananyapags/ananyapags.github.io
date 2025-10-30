import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown";
import { blogPosts } from "@/content/blog"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: "Post not found" }
  return {
    title: post.name,
    description: post.summary,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <>
      <Nav />
      <section className="relative px-4 py-12 sm:py-20">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="space-y-2">
            <h1 className="font-mono text-3xl sm:text-4xl font-bold text-neon-green crt">{post.name}</h1>
            <p className="font-mono text-sm text-[var(--muted)]">Runtime: {post.runtime}</p>
            <div className="flex flex-wrap gap-2">
              {post.stack.map((tech) => (
                <span key={tech} className="rounded border border-neon-cyan/30 bg-[var(--surface-1)]/50 px-2 py-1 font-mono text-xs text-neon-cyan">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <article className="max-w-none font-sans">
            <div className="text-sm sm:text-base leading-relaxed space-y-4">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="mb-4 text-2xl sm:text-3xl font-bold text-foreground" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="mt-6 mb-3 text-xl sm:text-2xl font-semibold text-foreground" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="text-foreground/90" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="text-foreground/90" {...props} />,
                  hr: () => <hr className="my-6 border-[var(--border)]" />,
                  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-neon-cyan underline underline-offset-4" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          <div className="pt-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto group border-neon-cyan font-mono text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:glow-soft bg-transparent focus:ring-2 focus:ring-neon-cyan"
            >
              <Link href="/#blog">
                ← Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}


