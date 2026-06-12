import { useRef } from 'react';
import { gsap, useGSAP, MM, D } from '@/lib/gsap';
import { onReveal } from '@/lib/animationGate';

interface CounterProps {
  to: number;
  from?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  trigger?: 'scroll' | 'gate';
}

/** Count-up that writes textContent directly — no React state per frame. */
const Counter = ({
  to,
  from = 0,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = D.lg,
  className,
  trigger = 'scroll',
}: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (v: number) =>
    `${prefix}${v.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const proxy = { v: from };
        el.textContent = format(from);

        const tween = gsap.to(proxy, {
          v: to,
          duration,
          ease: 'power2.out',
          paused: true,
          onUpdate: () => {
            el.textContent = format(proxy.v);
          },
        });

        if (trigger === 'gate') {
          onReveal(() => tween.play());
        } else {
          gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
              onEnter: () => tween.play(),
            },
          });
        }
        return () => tween.kill();
      });

      mm.add(MM.reduced, () => {
        el.textContent = format(to);
      });
    },
    { scope: ref, dependencies: [to] }
  );

  return (
    <span ref={ref} className={`tabular ${className ?? ''}`}>
      {format(to)}
    </span>
  );
};

export default Counter;
