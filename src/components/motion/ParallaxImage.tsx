import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, MM } from '@/lib/gsap';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** 0–0.3 sensible; fraction of element height to drift */
  speed?: number;
}

/** Scrub parallax drift for matted images. */
const ParallaxImage = ({ children, className, speed = 0.12 }: ParallaxProps) => {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!outer.current || !inner.current) return;
      const mm = gsap.matchMedia();

      mm.add(`${MM.motionOK} and ${MM.isDesktop}`, () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: outer.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: outer }
  );

  return (
    <div ref={outer} className={`overflow-hidden ${className ?? ''}`}>
      <div ref={inner} style={{ scale: `${1 + speed * 2}` }}>
        {children}
      </div>
    </div>
  );
};

export default ParallaxImage;
