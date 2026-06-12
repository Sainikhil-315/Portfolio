import { useRef } from 'react';
import { gsap, useGSAP, MM } from '@/lib/gsap';

interface ContestHistoryEntry {
  attended: boolean;
  rating: number;
  ranking: number;
  contest: {
    title: string;
    startTime: number;
  };
}

interface RatingChartProps {
  history: ContestHistoryEntry[];
}

/**
 * Contest rating line chart — accent line, hairline grid, mono axes.
 * All colors come from CSS vars so both themes work. Draws on scroll.
 */
const RatingChart = ({ history }: RatingChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const attended = history.filter((h) => h.attended && h.rating > 0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        });
        tl.from('[data-rating-line]', {
          drawSVG: '0%',
          duration: 1.4,
          ease: 'power2.inOut',
        })
          .from(
            '[data-rating-area]',
            { autoAlpha: 0, duration: 0.4, ease: 'power2.out' },
            '-=0.3'
          )
          .from(
            el.querySelectorAll('[data-rating-dot]'),
            {
              scale: 0,
              transformOrigin: 'center',
              duration: 0.3,
              ease: 'back.out(2)',
              stagger: 0.04,
            },
            '-=0.3'
          );
      });
    },
    { scope: ref, dependencies: [attended.length] }
  );

  if (attended.length < 2) {
    return (
      <p className="text-label flex h-40 items-center justify-center text-ink-muted">
        Awaiting contest history
      </p>
    );
  }

  const W = 560;
  const H = 200;
  const PL = 48;
  const PR = 16;
  const PT = 16;
  const PB = 28;
  const cW = W - PL - PR;
  const cH = H - PT - PB;

  const ratings = attended.map((h) => h.rating);
  const minR = Math.floor(Math.min(...ratings) / 50) * 50 - 50;
  const maxR = Math.ceil(Math.max(...ratings) / 50) * 50 + 50;

  const xScale = (i: number) => PL + (i / (attended.length - 1)) * cW;
  const yScale = (r: number) => PT + cH - ((r - minR) / (maxR - minR)) * cH;

  const pathD = attended
    .map((h, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(h.rating)}`)
    .join(' ');
  const areaD = `${pathD} L${xScale(attended.length - 1)},${PT + cH} L${PL},${PT + cH} Z`;

  const ticks: number[] = [];
  for (let v = minR; v <= maxR; v += 100) ticks.push(v);

  const step = Math.ceil(attended.length / 6);
  const accent = 'hsl(var(--accent))';
  const hairline = 'hsl(var(--hairline))';
  const muted = 'hsl(var(--ink-muted))';

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Contest rating over ${attended.length} contests, currently ${Math.round(attended[attended.length - 1].rating)}`}
      >
        <defs>
          <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.14" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.0" />
          </linearGradient>
          <clipPath id="chartClip">
            <rect x={PL} y={PT} width={cW} height={cH} />
          </clipPath>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PL}
              y1={yScale(t)}
              x2={PL + cW}
              y2={yScale(t)}
              stroke={hairline}
              strokeWidth={1}
            />
            <text
              x={PL - 8}
              y={yScale(t) + 3}
              textAnchor="end"
              fill={muted}
              fontSize={10}
              fontFamily="'Spline Sans Mono', monospace"
            >
              {t}
            </text>
          </g>
        ))}

        <path
          data-rating-area
          d={areaD}
          fill="url(#ratingGrad)"
          clipPath="url(#chartClip)"
        />
        <path
          data-rating-line
          d={pathD}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinejoin="round"
          clipPath="url(#chartClip)"
        />

        {attended.map((h, i) => {
          if (i % step !== 0 && i !== attended.length - 1) return null;
          const date = new Date(h.contest.startTime * 1000);
          const label = `${date.toLocaleString('default', { month: 'short' })} '${String(date.getFullYear()).slice(2)}`;
          return (
            <text
              key={h.contest.startTime}
              x={xScale(i)}
              y={H - 4}
              textAnchor="middle"
              fill={muted}
              fontSize={10}
              fontFamily="'Spline Sans Mono', monospace"
            >
              {label}
            </text>
          );
        })}

        {attended.map((h, i) => (
          <circle
            key={h.contest.startTime}
            data-rating-dot
            cx={xScale(i)}
            cy={yScale(h.rating)}
            r={3}
            fill={accent}
            stroke="hsl(var(--paper))"
            strokeWidth={1.5}
          />
        ))}

        <text
          x={xScale(attended.length - 1) - 8}
          y={yScale(attended[attended.length - 1].rating) - 8}
          textAnchor="end"
          fill={accent}
          fontSize={11}
          fontWeight="bold"
          fontFamily="'Spline Sans Mono', monospace"
        >
          {Math.round(attended[attended.length - 1].rating)}
        </text>
      </svg>
    </div>
  );
};

export default RatingChart;
