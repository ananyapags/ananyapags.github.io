import { Mail, Github, Linkedin } from "lucide-react"

const contactLinks = [
  {
    href: "mailto:ananyapag@gmail.com",
    icon: Mail,
    label: "Email",
    description: "ananyapag@gmail.com",
    color: "cyan",
  },
  {
    href: "https://www.linkedin.com/in/ananyapg/",
    icon: Linkedin,
    label: "LinkedIn",
    description: "/in/ananyapg",
    color: "pink",
  },
  {
    href: "https://github.com/ananyapags",
    icon: Github,
    label: "GitHub",
    description: "@ananyapags",
    color: "green",
  },
]

export default function ContactSection() {
  return (
    <section id="contact" className="relative min-h-screen px-4 py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl">
        <div>
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 font-mono text-3xl sm:text-4xl font-bold text-neon-green crt">Contact</h2>
            <p className="font-mono text-sm sm:text-base text-[var(--muted)]">
              {"Let's connect and build something amazing together"}
            </p>
          </div>

          {/* Contact Grid */}
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {contactLinks.map((link, index) => (
              <div key={link.href} className="h-full">
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`flex h-full w-full flex-col items-start justify-center gap-2 rounded-md border border-neon-${link.color}/30 bg-[var(--surface-1)]/50 p-6 text-left transition-all hover:border-neon-${link.color} hover:bg-neon-${link.color}/10 hover:glow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-${link.color}`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={`h-6 w-6 text-neon-${link.color}`} />
                    <span className={`font-mono text-lg font-semibold text-neon-${link.color}`}>{link.label}</span>
                  </div>
                  <p className="font-mono text-sm text-[var(--muted)]">{link.description}</p>
                </a>
              </div>
            ))}
          </div>

        
        </div>
      </div>
    </section>
  )
}
