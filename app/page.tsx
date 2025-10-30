import Nav from "@/components/Nav"
import HomeSection from "@/components/HomeSection"
import BlogSection from "@/components/BlogSection"
import WorkSection from "@/components/WorkSection"
import ContactSection from "@/components/ContactSection"

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="relative">
        <HomeSection />
        <WorkSection />
        <BlogSection />
        <ContactSection />
      </main>
    </>
  )
}
