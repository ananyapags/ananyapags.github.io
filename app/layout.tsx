import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ScanlineOverlay from "@/components/ScanlineOverlay"
import GridBackground from "@/components/GridBackground"

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
    <html lang="en">
      <body className="font-sans antialiased">
        <GridBackground />
        <ScanlineOverlay />
        {children}
      </body>
    </html>
  )
}
