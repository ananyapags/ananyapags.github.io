import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Terminal } from "lucide-react"
import Nav from "@/components/Nav"

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6 font-mono">
            <p className="text-8xl font-bold text-neon-magenta">404</p>
            <p className="mt-2 text-2xl text-neon-cyan">Page Not Found</p>
          </div>

          <p className="mb-8 text-muted-foreground">The requested resource could not be located in the system.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="border-neon-green bg-neon-green/10 font-mono text-neon-green hover:bg-neon-green/20 hover:glow-green"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Return Home
              </Link>
            </Button>

            
          </div>
        </div>
      </main>
    </>
  )
}
