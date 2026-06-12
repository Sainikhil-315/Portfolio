import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Marquee from '@/components/motion/Marquee';
import { site, socials } from '@/content/site';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

const GravityName = lazy(() => import('@/components/webgl/GravityName'));

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

/**
 * Unveil footer: fixed behind the page; a measured spacer in normal flow
 * reserves its height, so main (z-10, opaque) scrolls up to reveal it.
 */
const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);
  const [nearFooter, setNearFooter] = useState(false);
  const spacerRef = useRef<HTMLDivElement>(null);
  const time = useISTClock();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // lazy-mount the physics toy only when the footer approaches the viewport
  useEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNearFooter(true),
      { rootMargin: '400px' }
    );
    io.observe(spacer);
    return () => io.disconnect();
  }, []);

  const isDesktopFine =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
      .matches;

  return (
    <>
      <div ref={spacerRef} style={{ height }} aria-hidden />
      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 z-0 w-full bg-[#1A1714] text-[#EAE5DA]"
      >
        <div className="relative">
          {nearFooter && isDesktopFine && (
            <Suspense fallback={null}>
              <div className="absolute inset-0 z-0">
                <GravityName />
              </div>
            </Suspense>
          )}

          <div className="pointer-events-none relative z-10 pt-16 md:pt-20">
            <Marquee
              speed={40}
              className="border-y border-[#EAE5DA]/15 py-4"
            >
              <span className="text-display-xl px-8 text-[#EAE5DA]/90">
                {site.name.toUpperCase()} —
              </span>
            </Marquee>

            <div className="page-margin grid gap-10 py-12 md:grid-cols-3 md:py-16">
              <div className="pointer-events-auto flex flex-col gap-3">
                <span className="text-label text-[#EAE5DA]/40">Socials</span>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label w-fit text-[#EAE5DA]/80 transition-colors hover:text-[#6670FF]"
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>

              <div className="pointer-events-auto flex flex-col gap-3">
                <span className="text-label text-[#EAE5DA]/40">Local time</span>
                <span className="text-label text-[#EAE5DA]/80">
                  IST — {time}
                </span>
                <button
                  onClick={() => scrollTo(0)}
                  className="text-label mt-4 w-fit text-[#EAE5DA]/80 transition-colors hover:text-[#6670FF]"
                >
                  Back to top ↑
                </button>
              </div>

              <div className="flex flex-col gap-3 md:text-right">
                <span className="text-label text-[#EAE5DA]/40">Colophon</span>
                <p className="text-label leading-relaxed text-[#EAE5DA]/80">
                  ©2026 — Designed & built by {site.name}
                  <br />
                  Set in Fraunces & Archivo
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
