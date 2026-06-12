import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

interface SmoothScrollContextValue {
  /** scroll to a hash/element/position through Lenis (or native fallback) */
  scrollTo: (target: string | HTMLElement | number, offset?: number) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Lenis in WINDOW mode only — no wrapper/content options. Keeps native
 * position:fixed/sticky working and ScrollTrigger pinning on default pinType.
 */
const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      syncTouch: false,
      anchors: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onFontsReady = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(onFontsReady);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value: SmoothScrollContextValue = {
    scrollTo: (target, offset = -96) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target as string | HTMLElement | number, {
          offset,
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(2, -10 * t),
        });
        return;
      }
      // reduced-motion / no-Lenis fallback
      if (typeof target === 'number') {
        window.scrollTo(0, target);
      } else {
        const el =
          typeof target === 'string' ? document.querySelector(target) : target;
        el?.scrollIntoView();
      }
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
