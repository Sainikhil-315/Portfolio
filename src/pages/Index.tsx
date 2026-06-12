import Header from '@/components/layout/Header';
import Preloader from '@/components/layout/Preloader';
import GrainOverlay from '@/components/layout/GrainOverlay';
import Cursor from '@/components/motion/Cursor';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Achievements from '@/components/sections/Achievements';
import Contact from '@/components/sections/Contact';

/**
 * Preloader is a fixed OVERLAY — the page mounts beneath it so the curtain
 * lift can hand off to gated entrance timelines. Keep it that way.
 * Footer is fixed behind <main> (unveil pattern); main needs z-10 + opaque bg.
 */
const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Preloader />
    <GrainOverlay />
    <Cursor />
    <Header />

    <main className="relative z-10 bg-background">
      <section id="home">
        <Hero />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="experience">
        <Experience />
      </section>

      <section id="skills">
        <Skills />
      </section>

      <section id="projects">
        <Projects />
      </section>

      <section id="achievements">
        <Achievements />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
