import { useRef, useState } from 'react';
import { gsap, useGSAP, EASE, prefersReducedMotion } from '@/lib/gsap';
import {
  releaseReveal,
  hasSeenIntro,
  markIntroSeen,
} from '@/lib/animationGate';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { site } from '@/content/site';

/**
 * Fixed-overlay preloader. The page is ALWAYS mounted beneath it — this
 * overlay model is load-bearing: the curtain lift hands off to gated
 * entrance timelines (Hero, Header) via releaseReveal(). Do not convert
 * back to a conditional render.
 *
 * Center act: "ink-fill" — liquid ink rises inside the outlined name,
 * synced to the load counter.
 */
const Preloader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const { stop, start } = useSmoothScroll();

  useGSAP(
    () => {
      const el = ref.current;
      const fill = fillRef.current;
      const pct = pctRef.current;
      if (!el || !fill || !pct) return;

      // repeat visit or reduced motion: quick fade, no ceremony
      if (hasSeenIntro() || prefersReducedMotion()) {
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.5,
          delay: 0.15,
          ease: 'power2.out',
          onStart: () => {
            releaseReveal();
            start();
          },
          onComplete: () => {
            markIntroSeen();
            setDone(true);
          },
        });
        return;
      }

      stop();

      const proxy = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => setDone(true) });

      // 1 — brand + outlined name in
      tl.from(['[data-pre-brand]', '[data-pre-name]'], {
        autoAlpha: 0,
        y: 12,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.08,
      });

      // 2 — ink rises inside the letters, percent counts up
      tl.to(
        proxy,
        {
          v: 100,
          duration: 1.9,
          ease: 'power2.inOut',
          onUpdate: () => {
            // bobbing surface while rising; settles flat at 100
            const wobble =
              Math.sin(proxy.v * 0.55) * 0.6 * (1 - proxy.v / 100);
            const top = Math.max(0, 100 - proxy.v + wobble);
            fill.style.clipPath = `inset(${top}% 0 0 0)`;
            pct.textContent = `${String(Math.round(proxy.v)).padStart(3, '0')}%`;
          },
        },
        0.25
      );

      // 3 — beat at 100%: accent flash inside the letters
      // (GSAP can't interpolate hsl(var(--x)) — resolve to a concrete color)
      const accentColor = `hsl(${getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim()})`;
      tl.to(fill, {
        color: accentColor,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: 'none',
      });

      // 4 — name + percent lift away (masked), brand follows
      tl.to(
        ['[data-pre-name-mask] > *', '[data-pre-brand]'],
        {
          yPercent: -110,
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power2.in',
          stagger: 0.05,
        },
        '+=0.15'
      );

      // 5 — curtain lift: accent panel chases the paper panel
      tl.add(() => {
        releaseReveal();
        start();
      });
      tl.to('[data-pre-curtain-accent]', {
        yPercent: -100,
        duration: 0.9,
        ease: EASE.hop,
      });
      tl.to(
        '[data-pre-curtain]',
        { yPercent: -100, duration: 0.9, ease: EASE.hop },
        '-=0.75'
      );
    },
    { scope: ref }
  );

  if (done) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100]"
      aria-label="Loading"
      role="status"
    >
      {/* accent flash panel sits behind the main curtain */}
      <div data-pre-curtain-accent className="absolute inset-0 bg-accent" />
      <div data-pre-curtain className="absolute inset-0 flex flex-col bg-paper">
        <div data-pre-brand className="page-margin pt-8">
          <p className="text-label text-ink-muted">
            {site.name.toUpperCase()} — PORTFOLIO ©2026
          </p>
        </div>

        {/* ink-fill name */}
        <div className="flex flex-1 items-center justify-center">
          <div data-pre-name-mask className="overflow-hidden">
            <div data-pre-name className="relative">
              <span
                className="text-outline block text-center font-sans font-bold uppercase leading-none tracking-tight"
                style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}
                aria-hidden
              >
                Sai&nbsp;Nikhil
              </span>
              <span
                ref={fillRef}
                className="absolute inset-0 block text-center font-sans font-bold uppercase leading-none tracking-tight text-ink"
                style={{
                  fontSize: 'clamp(3rem, 11vw, 10rem)',
                  clipPath: 'inset(100% 0 0 0)',
                }}
              >
                Sai&nbsp;Nikhil
              </span>
              <span
                ref={pctRef}
                className="text-label tabular absolute -bottom-7 right-0 text-ink-muted"
              >
                000%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
