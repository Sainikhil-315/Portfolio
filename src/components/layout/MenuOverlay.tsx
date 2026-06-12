import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { navLinks, site, socials } from '@/content/site';

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const useISTClock = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
};

/** Fullscreen ink-inverted menu — paper flips to ink, links in display type. */
const MenuOverlay = ({ open, onClose, onNavigate }: MenuOverlayProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const time = useISTClock();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: open ? 1 : 0 });
        return;
      }

      if (open) {
        const tl = gsap.timeline();
        tl.set(el, { autoAlpha: 1 })
          .fromTo(
            el,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.7,
              ease: 'power4.inOut',
            }
          )
          .from(
            el.querySelectorAll('[data-menu-link]'),
            {
              yPercent: 110,
              duration: 0.7,
              ease: 'expo.out',
              stagger: 0.06,
            },
            '-=0.25'
          )
          .from(
            el.querySelectorAll('[data-menu-meta]'),
            { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.05 },
            '-=0.4'
          );
      } else {
        gsap.to(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.5,
          ease: 'power4.inOut',
          onComplete: () => gsap.set(el, { autoAlpha: 0 }),
        });
      }
    },
    { dependencies: [open] }
  );

  // lock background scroll while open
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="invisible fixed inset-0 z-[70] flex flex-col bg-ink text-paper opacity-0"
      aria-hidden={!open}
    >
      <div className="page-margin flex h-16 items-center justify-between md:h-20">
        <span className="font-serif-italic text-xl">{site.firstName}</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="text-label text-paper/70 transition-colors hover:text-paper"
        >
          Close ✕
        </button>
      </div>

      <nav
        className="page-margin flex flex-1 flex-col justify-center gap-1"
        aria-label="Menu"
      >
        {navLinks.map((link) => (
          <div key={link.href} className="overflow-hidden">
            <button
              data-menu-link
              onClick={() => onNavigate(link.href)}
              className="group flex items-baseline gap-4 py-1 text-left"
            >
              <span className="text-label text-accent">{link.index}</span>
              <span className="text-display-lg text-paper transition-colors duration-300 group-hover:text-accent">
                {link.label}
              </span>
            </button>
          </div>
        ))}
      </nav>

      <div className="page-margin hairline-t flex flex-wrap items-center justify-between gap-4 py-6 [&]:border-paper/20">
        <div data-menu-meta className="flex gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label text-paper/70 transition-colors hover:text-paper"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
        <span data-menu-meta className="text-label text-paper/50">
          IST — {time}
        </span>
      </div>
    </div>
  );
};

export default MenuOverlay;
