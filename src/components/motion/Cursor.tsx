import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const SIZE = 28;

/**
 * Single inverted-circle cursor: one white disc under mix-blend-difference —
 * it flips whatever sits beneath it (ink type, paper, images). Grows over
 * interactive elements. Fine pointers only; native cursor hidden by the
 * matching media rule in index.css.
 */
const Cursor = () => {
  const [enabled, setEnabled] = useState(false);
  const discRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(fine && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const disc = discRef.current;
    if (!disc) return;

    gsap.set(disc, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const x = gsap.quickTo(disc, 'x', { duration: 0.18, ease: 'power3' });
    const y = gsap.quickTo(disc, 'y', { duration: 0.18, ease: 'power3' });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set(disc, { x: e.clientX, y: e.clientY });
        gsap.to(disc, { autoAlpha: 1, duration: 0.25 });
      }
      x(e.clientX);
      y(e.clientY);
    };

    const scaleFor = (target: Element | null) => {
      if (target?.closest('[data-cursor="view"], [data-cursor="drag"]')) return 2.4;
      if (target?.closest('a, button, [role="button"]')) return 1.7;
      return 1;
    };

    const onOver = (e: PointerEvent) => {
      gsap.to(disc, {
        scale: scaleFor(e.target as Element),
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const onLeaveDoc = () => {
      visible = false;
      gsap.to(disc, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveDoc);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] mix-blend-difference"
    >
      <div
        ref={discRef}
        className="absolute left-0 top-0 rounded-full bg-white will-change-transform"
        style={{ width: SIZE, height: SIZE }}
      />
    </div>
  );
};

export default Cursor;
