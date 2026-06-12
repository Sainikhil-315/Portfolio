import { useRef } from 'react';
import { gsap, useGSAP, MM } from '@/lib/gsap';

interface SolvedBarProps {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

const SEGMENTS = [
  { key: 'easy', label: 'Easy', color: 'hsl(var(--lc-easy))' },
  { key: 'medium', label: 'Medium', color: 'hsl(var(--lc-medium))' },
  { key: 'hard', label: 'Hard', color: 'hsl(var(--lc-hard))' },
] as const;

/** Full-width segmented bar — Swiss data viz, replaces the donut. */
const SolvedBar = ({ easy, medium, hard, total }: SolvedBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const counts = { easy, medium, hard };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        gsap.from(el.querySelectorAll('[data-segment]'), {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref}>
      <div className="flex h-3.5 gap-0.5">
        {SEGMENTS.map((seg) => {
          const count = counts[seg.key];
          const pct = total > 0 ? (count / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={seg.key}
              data-segment
              style={{ width: `${pct}%`, background: seg.color }}
              title={`${seg.label}: ${count}`}
            />
          );
        })}
      </div>

      <dl className="mt-5">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            className="hairline-b flex items-center justify-between py-2.5"
          >
            <dt className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5"
                style={{ background: seg.color }}
              />
              <span className="text-label text-ink-muted">{seg.label}</span>
            </dt>
            <dd className="font-mono text-sm tabular text-ink">
              {counts[seg.key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default SolvedBar;
