import Hero from "./components/sections/Hero";
import Showreel from "./components/sections/Showreel";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";

export default function Page() {
  return (
    <main className="text-white">
      <Hero
        videoSrc="/me/videos/hero.mp4"
        name="Your Name"
        headline="Build Systems. Ship Beauty."
        subheadline="Backend reliability + frontend polish. Galaxy visuals, fast UX, and clean engineering."
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-white/70">Portfolio section placeholder</p>
        </div>
      </section>

      <section id="contact" className="galaxy stars border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-white/70">Contact section placeholder</p>
        </div>
      </section>
    </main>
  );
}
