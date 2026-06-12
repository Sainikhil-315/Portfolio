import { useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, MM } from '@/lib/gsap';
import { onReveal } from '@/lib/animationGate';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { navLinks, site } from '@/content/site';
import ThemeToggle from '@/components/ui-custom/ThemeToggle';
import MenuOverlay from '@/components/layout/MenuOverlay';

const Header = () => {
  const ref = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        // entrance: slide down after preloader curtain
        gsap.set(el, { yPercent: -110 });
        onReveal(() => {
          gsap.to(el, { yPercent: 0, duration: 0.9, ease: 'expo.out', delay: 0.5 });
        });

        // hide on scroll-down, show on scroll-up — tween, not setState
        const st = ScrollTrigger.create({
          start: 'top top',
          end: 'max',
          onUpdate: (self) => {
            if (self.scroll() < 80) {
              gsap.to(el, { yPercent: 0, duration: 0.4, ease: 'power3', overwrite: true });
              return;
            }
            gsap.to(el, {
              yPercent: self.direction === 1 ? -110 : 0,
              duration: 0.4,
              ease: 'power3',
              overwrite: true,
            });
          },
        });
        return () => st.kill();
      });

      mm.add(MM.reduced, () => {
        gsap.set(el, { yPercent: 0, clearProps: 'transform' });
      });

      // backdrop state — cheap, fires rarely
      const st2 = ScrollTrigger.create({
        start: 50,
        end: 'max',
        onToggle: (self) => setScrolled(self.isActive),
      });
      return () => st2.kill();
    },
    { scope: ref }
  );

  const handleNav = (href: string) => {
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        ref={ref}
        className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? 'border-b border-hairline bg-paper/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="page-margin flex h-16 items-center justify-between md:h-20">
          <button
            onClick={() => scrollTo(0)}
            className="font-serif-italic text-xl text-ink transition-colors hover:text-accent"
          >
            {site.firstName}
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-label group relative text-ink-muted transition-colors hover:text-ink"
              >
                <span className="mr-1.5 text-accent">{link.index}</span>
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href={site.resumePath}
              download="Sai_Nikhil_Mullapudi_Resume.pdf"
              className="text-label hidden rounded-full border border-hairline px-4 py-2.5 text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink md:inline-block"
            >
              Resume ↗
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span className="h-px w-6 bg-ink" />
              <span className="h-px w-6 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNav} />
    </>
  );
};

export default Header;
