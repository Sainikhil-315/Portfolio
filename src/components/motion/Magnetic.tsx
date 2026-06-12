import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, MM, EASE } from '@/lib/gsap';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Magnetic hover wrapper — fine pointers only, elastic release. */
const Magnetic = ({ children, className, strength = 0.35 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(`${MM.motionOK} and ${MM.finePointer}`, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((e.clientX - rect.left - rect.width / 2) * strength);
          yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: EASE.spring });
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
};

export default Magnetic;
