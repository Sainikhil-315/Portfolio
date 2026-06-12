import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, ScrollTrigger, MM } from '@/lib/gsap';

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** base loop duration in seconds (lower = faster) */
  speed?: number;
  direction?: 1 | -1;
  /** speed up with scroll velocity (desktop) */
  scrollReactive?: boolean;
  pauseOnHover?: boolean;
}

/**
 * Infinite marquee. Content duplicated 2×; GSAP drives xPercent loop.
 * CSS keyframe (.marquee-track) is the reduced-motion-safe fallback —
 * GSAP takes over by clearing the CSS animation when active.
 */
const Marquee = ({
  children,
  className,
  trackClassName,
  speed = 30,
  direction = -1,
  scrollReactive = true,
  pauseOnHover = false,
  ...rest
}: MarqueeProps) => {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        el.style.animation = 'none';

        const loop = gsap.to(el, {
          xPercent: direction === -1 ? -50 : 50,
          repeat: -1,
          duration: speed,
          ease: 'none',
        });
        if (direction === 1) gsap.set(el, { xPercent: -50 });

        let st: ScrollTrigger | undefined;
        if (scrollReactive) {
          st = ScrollTrigger.create({
            trigger: wrap.current,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              const v = gsap.utils.clamp(
                -3,
                3,
                self.getVelocity() / 300
              );
              gsap.to(loop, {
                timeScale: 1 + Math.abs(v),
                duration: 0.4,
                overwrite: true,
              });
            },
          });
        }

        const onEnter = () => pauseOnHover && loop.pause();
        const onLeave = () => pauseOnHover && loop.play();
        wrap.current?.addEventListener('pointerenter', onEnter);
        wrap.current?.addEventListener('pointerleave', onLeave);

        return () => {
          st?.kill();
          loop.kill();
          wrap.current?.removeEventListener('pointerenter', onEnter);
          wrap.current?.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className={`overflow-hidden ${className ?? ''}`} {...rest}>
      <div
        ref={track}
        className={`marquee-track flex w-max whitespace-nowrap ${trackClassName ?? ''}`}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
