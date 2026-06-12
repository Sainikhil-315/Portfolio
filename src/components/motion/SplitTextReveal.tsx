import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, SplitText, MM, D, STAGGER } from '@/lib/gsap';
import { onReveal } from '@/lib/animationGate';

interface SplitTextRevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  type?: 'chars' | 'words' | 'lines';
  /** scroll-triggered (default) or gated behind the preloader reveal */
  trigger?: 'scroll' | 'gate';
  start?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  rotate?: number;
}

/**
 * Masked split-text entrance. Parent stays visibility:hidden ([data-split])
 * until onSplit reveals — no unsplit flash; SplitText aria keeps a11y intact.
 */
const SplitTextReveal = ({
  as: Tag = 'div',
  children,
  className,
  type = 'lines',
  trigger = 'scroll',
  start = 'top 80%',
  stagger,
  delay = 0,
  duration = D.lg,
  rotate = 0,
}: SplitTextRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const split = SplitText.create(el, {
          type: type === 'chars' ? 'chars,lines' : type,
          mask: 'lines',
          autoSplit: true,
          aria: 'auto',
          onSplit: (self) => {
            const targets =
              type === 'chars'
                ? self.chars
                : type === 'words'
                  ? self.words
                  : self.lines;

            gsap.set(el, { autoAlpha: 1 });

            const vars = {
              yPercent: 110,
              rotate,
              duration,
              delay,
              ease: 'expo.out' as const,
              stagger:
                stagger ??
                (type === 'chars'
                  ? STAGGER.chars
                  : type === 'words'
                    ? STAGGER.words
                    : STAGGER.items),
            };

            if (trigger === 'gate') {
              const tween = gsap.from(targets, { ...vars, paused: true });
              onReveal(() => tween.play());
              return tween;
            }

            return gsap.from(targets, {
              ...vars,
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });

      mm.add(MM.reduced, () => {
        gsap.set(el, { autoAlpha: 1 });
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
};

export default SplitTextReveal;
