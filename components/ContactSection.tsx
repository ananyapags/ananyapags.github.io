"use client"

import { motion } from "framer-motion"
import { Mail, Github, Linkedin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  {
    href: "/resume.pdf",
    icon: FileText,
    label: "Resume",
    description: "Download PDF",
    color: "cyan",
  },
]

export default function ContactSection() {
  return (
    <section id="contact" className="relative min-h-screen px-4 py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 font-mono text-3xl sm:text-4xl font-bold text-neon-green crt">Contact</h2>
            <p className="font-mono text-sm sm:text-base text-[var(--muted)]">
              Let's connect and build something amazing together
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contactLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className={`h-auto w-full flex-col items-start gap-2 border-neon-${link.color}/30 bg-[var(--surface-1)]/50 p-6 text-left transition-all hover:border-neon-${link.color} hover:bg-neon-${link.color}/10 hover:glow-soft focus:ring-2 focus:ring-neon-${link.color}`}
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`h-6 w-6 text-neon-${link.color}`} />
                      <span className={`font-mono text-lg font-semibold text-neon-${link.color}`}>{link.label}</span>
                    </div>
                    <p className="font-mono text-sm text-[var(--muted)]">{link.description}</p>
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="font-mono text-sm text-[var(--muted)]">
              Response time: &lt;24h | Always open to interesting opportunities
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
