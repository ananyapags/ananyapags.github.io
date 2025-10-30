import type React from "react"
import type { Metadata } from "next"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import ScanlineOverlay from "@/components/ScanlineOverlay"
import GridBackground from "@/components/GridBackground"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Pags Home",
  description: "Developer passionate about High Performance Computing and Performance Engineering",

  openGraph: {
    title: "Pags Home",
    description: "Developer passionate about High Performance Computing and Performance Engineering",
    type: "website",
    images: [
      {
        url: "/VoltageEmoji.png",
        width: 1000,
        height: 630,
        alt: "Pags Home",
      },
    ],
  },
  icons: {
    icon: "/VoltageEmoji.png",
    apple: "/VoltageEmoji.png",
  },
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <GridBackground />
          <ScanlineOverlay />
          {children}

        </ThemeProvider>
      </body>
    </html>
  )
}
