import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, MM, D, STAGGER } from '@/lib/gsap';

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  start?: string;
  /** animate direct children individually instead of the wrapper */
  childSelector?: string;
}

/** Generic scroll-entrance: fade-up wrapper or staggered children. */
const Reveal = ({
  as: Tag = 'div',
  children,
  className,
  y = 40,
  stagger = STAGGER.items,
  start = 'top 82%',
  childSelector,
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const targets = childSelector
          ? el.querySelectorAll(childSelector)
          : el;
        gsap.from(targets, {
          autoAlpha: 0,
          y,
          duration: D.md,
          ease: 'expo.out',
          stagger: childSelector ? stagger : 0,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default Reveal;
