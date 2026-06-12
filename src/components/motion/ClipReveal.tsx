import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, MM, D } from '@/lib/gsap';
import { onReveal } from '@/lib/animationGate';

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  from?: 'bottom' | 'left' | 'center';
  trigger?: 'scroll' | 'gate';
  delay?: number;
}

/** Clip-path wipe + counter-scale inner settle (the editorial image reveal). */
const ClipReveal = ({
  children,
  className,
  from = 'bottom',
  trigger = 'scroll',
  delay = 0,
}: ClipRevealProps) => {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const o = outer.current;
      const i = inner.current;
      if (!o || !i) return;

      const clipFrom =
        from === 'bottom'
          ? 'inset(100% 0% 0% 0%)'
          : from === 'left'
            ? 'inset(0% 100% 0% 0%)'
            : 'inset(50% 50% 50% 50%)';

      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const tl = gsap.timeline({ paused: true, delay });
        tl.fromTo(
          o,
          { clipPath: clipFrom },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: D.lg, ease: 'expo.out' }
        ).fromTo(
          i,
          { scale: 1.25 },
          { scale: 1, duration: D.lg, ease: 'expo.out' },
          '<'
        );

        if (trigger === 'gate') {
          onReveal(() => tl.play());
        } else {
          gsap.timeline({
            scrollTrigger: {
              trigger: o,
              start: 'top 85%',
              once: true,
              onEnter: () => tl.play(),
            },
          });
        }
        return () => tl.kill();
      });
    },
    { scope: outer }
  );

  return (
    <div ref={outer} className={`overflow-hidden ${className ?? ''}`}>
      <div ref={inner}>{children}</div>
    </div>
  );
};

export default ClipReveal;
