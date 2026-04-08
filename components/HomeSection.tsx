import { Mail, Github, Linkedin } from "lucide-react"

export default function HomeSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:py-20"
    >
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundColor: "transparent",
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.035) 0.7px, transparent 0.7px),
            radial-gradient(rgba(0, 255, 153, 0.03) 0.6px, transparent 0.6px)
          `,
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "18px 18px, 24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Greeting */}
        <div className="mb-4 sm:mb-6">
          <h1 className="font-mono text-xl sm:text-2xl md:text-3xl text-balance">
            {"Hi 👋, I'm "}
            <span className="crt text-2xl sm:text-3xl md:text-4xl font-bold text-neon-green">Pags </span>
            {" — Let’s build for "}
            <span className="text-neon-cyan font-bold">speed ⚡️</span>
            {" :)"}
            <span className="animate-pulse text-neon-pink">_</span>
          </h1>
        </div>

        {/* Description */}
        <div className="mx-auto mb-6 sm:mb-8 max-w-2xl space-y-3 px-4 text-pretty leading-relaxed sm:space-y-4">
          <p className="text-base sm:text-lg text-[var(--muted)]">
            Developer passionate about{" "}
            <span className="font-semibold text-neon-green">High Performance Computing</span> and{" "}
            <span className="font-semibold text-neon-green">Performance Engineering</span>.
            {" I'm also committed to advancing women's leadership in engineering and enjoy mentoring others in the field!"}
          </p>

          <div className="rounded-lg border border-neon-pink/30 bg-[var(--surface-1)]/50 p-3 sm:p-4 backdrop-blur-sm">
            <p className="font-mono text-xs sm:text-sm">
            <span className="text-neon-pink">Readings:</span>
            <br />
            <em>Completed</em>
{" Volumes I–IV of "}
<a href="https://github.com/VictorEijkhout/TheArtofHPC_pdfs/tree/main" target="_blank" rel="noopener noreferrer" className="underline text-neon-cyan">
  {"\"The Art of HPC\""}
</a>
{" by Eijkhout, whose abstractions persist within modern ML systems. "}
<br />
<em>Currently</em>
{" reading "}
<a href="https://www.cis.upenn.edu/~bcpierce/tapl/" target="_blank" rel="noopener noreferrer" className="underline text-neon-cyan italic">
  {"\"Types and Programming Languages\""}
</a>
{" by Pierce; open to collaborative reading and translating these constructs into contemporary applications."}
            </p>
          </div>

          <p className="text-base sm:text-lg text-[var(--muted)]">
            {"I'm actively seeking explorative opportunities and love connecting with others who share interests. Say hi or let's work together!"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:flex-wrap sm:gap-4">

          <a
            href="mailto:ananyapag@gmail.com"
            className="group inline-flex h-10 w-full items-center justify-center rounded-md border border-neon-cyan bg-transparent px-6 font-mono text-sm text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:glow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan sm:w-auto"
          >
            <Mail className="mr-2 h-5 w-5" />
            Email Me
          </a>

          <a
            href="https://github.com/ananyapags"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-10 w-full items-center justify-center rounded-md border border-neon-green bg-transparent px-6 font-mono text-sm text-neon-green transition-all hover:bg-neon-green/10 hover:glow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green sm:w-auto"
          >
            <Github className="mr-2 h-5 w-5" />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ananyapg/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-10 w-full items-center justify-center rounded-md border border-neon-pink bg-transparent px-6 font-mono text-sm text-neon-pink transition-all hover:bg-neon-pink/10 hover:glow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink sm:w-auto"
          >
            <Linkedin className="mr-2 h-5 w-5" />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
