import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Portfolio from "./components/sections/Portfolio";
import Contact from "./components/sections/Contact";

export default function Page() {
  return (
    <main className="text-white">
      <Hero
        videoSrc="/me/videos/hero.mp4"
        name="Abdul Salam"
        headline="Engineering systems that scale — beautifully."
        subheadline="I design and build reliable software, elegant interfaces, and business-ready platforms. From architecture to execution, with taste and discipline."
        primaryCta={{ label: "Explore Portfolio", href: "#portfolio" }}
        secondaryCta={{ label: "Contact Me", href: "#contact" }}
      />

      <section id="about" className="galaxy stars border-t border-white/10">
        <About />
      </section>

      <section id="skills" className="galaxy stars border-t border-white/10">
        <Skills />
      </section>

      <section id="portfolio" className="galaxy stars border-t border-white/10">
        <Portfolio />
      </section>

      <section id="contact" className="galaxy stars border-t border-white/10">
        <Contact />
      </section>
    </main>
  );
}
