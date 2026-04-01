import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LeetCodeStats {
  username: string;
  avatar?: string;
  realName?: string;
  problemsSolved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  submissions: {
    total: number;
  };
  contest: {
    attended: number;
    rating: number;
    ranking: number;
    totalParticipants?: number;
    topPercentage?: number;
  };
  contestHistory?: ContestHistoryEntry[];
}

interface ContestHistoryEntry {
  attended: boolean;
  rating: number;
  ranking: number;
  contest: {
    title: string;
    startTime: number;
  };
}

// Donut chart using SVG
const DonutChart = ({ easy, medium, hard, total }: { easy: number; medium: number; hard: number; total: number }) => {
  const size = 160;
  const strokeWidth = 18;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  const easyPct = total > 0 ? easy / total : 0;
  const medPct = total > 0 ? medium / total : 0;
  const hardPct = total > 0 ? hard / total : 0;
  const gap = 0.015;

  const easyLen = (easyPct - gap) * circ;
  const medLen = (medPct - gap) * circ;
  const hardLen = (hardPct - gap) * circ;

  const easyOffset = 0;
  const medOffset = -easyPct * circ;
  const hardOffset = -(easyPct + medPct) * circ;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* bg track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      {/* easy */}
      {easyLen > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#00b8a3"
          strokeWidth={strokeWidth}
          strokeDasharray={`${easyLen} ${circ}`}
          strokeDashoffset={easyOffset}
          strokeLinecap="round"
        />
      )}
      {/* medium */}
      {medLen > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#ffc01e"
          strokeWidth={strokeWidth}
          strokeDasharray={`${medLen} ${circ}`}
          strokeDashoffset={medOffset}
          strokeLinecap="round"
        />
      )}
      {/* hard */}
      {hardLen > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#ef4743"
          strokeWidth={strokeWidth}
          strokeDasharray={`${hardLen} ${circ}`}
          strokeDashoffset={hardOffset}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

// Inline SVG line chart for contest rating
const RatingLineChart = ({ history }: { history: ContestHistoryEntry[] }) => {
  const attended = history.filter(h => h.attended && h.rating > 0);
  if (attended.length < 2) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
        Not enough contest data to plot
      </div>
    );
  }

  const W = 560;
  const H = 180;
  const PL = 48, PR = 16, PT = 16, PB = 28;
  const cW = W - PL - PR;
  const cH = H - PT - PB;

  const ratings = attended.map(h => h.rating);
  const minR = Math.floor(Math.min(...ratings) / 50) * 50 - 50;
  const maxR = Math.ceil(Math.max(...ratings) / 50) * 50 + 50;

  const xScale = (i: number) => PL + (i / (attended.length - 1)) * cW;
  const yScale = (r: number) => PT + cH - ((r - minR) / (maxR - minR)) * cH;

  const pts = attended.map((h, i) => `${xScale(i)},${yScale(h.rating)}`).join(' ');
  const pathD = attended.map((h, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(h.rating)}`).join(' ');

  // area fill
  const areaD = `${pathD} L${xScale(attended.length - 1)},${PT + cH} L${PL},${PT + cH} Z`;

  // y-axis ticks
  const ticks: number[] = [];
  for (let v = minR; v <= maxR; v += 100) ticks.push(v);

  // x labels — show every Nth
  const step = Math.ceil(attended.length / 6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc01e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffc01e" stopOpacity="0.02" />
        </linearGradient>
        <clipPath id="chartClip">
          <rect x={PL} y={PT} width={cW} height={cH} />
        </clipPath>
      </defs>

      {/* grid lines */}
      {ticks.map(t => (
        <g key={t}>
          <line
            x1={PL} y1={yScale(t)} x2={PL + cW} y2={yScale(t)}
            stroke="rgba(255,255,255,0.07)" strokeWidth={1}
          />
          <text x={PL - 6} y={yScale(t) + 4} textAnchor="end"
            fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily="'JetBrains Mono', monospace"
          >
            {t}
          </text>
        </g>
      ))}

      {/* area */}
      <path d={areaD} fill="url(#ratingGrad)" clipPath="url(#chartClip)" />

      {/* line */}
      <path d={pathD} fill="none" stroke="#ffc01e" strokeWidth={2} strokeLinejoin="round" clipPath="url(#chartClip)" />

      {/* x labels */}
      {attended.map((h, i) => {
        if (i % step !== 0 && i !== attended.length - 1) return null;
        const date = new Date(h.contest.startTime * 1000);
        const label = `${date.toLocaleString('default', { month: 'short' })} '${String(date.getFullYear()).slice(2)}`;
        return (
          <text key={i} x={xScale(i)} y={H - 4} textAnchor="middle"
            fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily="'JetBrains Mono', monospace"
          >
            {label}
          </text>
        );
      })}

      {/* data points */}
      {attended.map((h, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(h.rating)} r={3}
          fill="#ffc01e" stroke="#1a1a2e" strokeWidth={1.5}
          clipPath="url(#chartClip)"
        />
      ))}

      {/* last rating label */}
      <text
        x={xScale(attended.length - 1) + 8}
        y={yScale(attended[attended.length - 1].rating) + 4}
        fill="#ffc01e" fontSize={11} fontWeight="bold" fontFamily="'JetBrains Mono', monospace"
      >
        {Math.round(attended[attended.length - 1].rating)}
      </text>
    </svg>
  );
};

// Rating badge like LeetCode
const getRatingBadge = (rating: number) => {
  if (rating >= 2400) return { label: 'Guardian', color: '#ff0000', glow: '#ff000066' };
  if (rating >= 2100) return { label: 'Knight', color: '#ff7500', glow: '#ff750066' };
  if (rating >= 1600) return { label: 'Expert', color: '#2196f3', glow: '#2196f366' };
  if (rating >= 1200) return { label: 'Specialist', color: '#03a89e', glow: '#03a89e66' };
  return { label: 'Newcomer', color: '#888', glow: '#88888866' };
};

// Achievements Continuous Scroll Carousel
const AchievementsImageCarousel = ({ images }: { images: string[] }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const SCROLL_SPEED = 0.5; // pixels per frame
  const ITEM_WIDTH = 280; // width of each image
  const GAP = 16; // gap between images

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setScrollPosition(prev => {
        const maxScroll = images.length * (ITEM_WIDTH + GAP);
        const nextPos = prev + SCROLL_SPEED;
        return nextPos >= maxScroll ? 0 : nextPos;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px',
        backdropFilter: 'blur(12px)',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
        borderRadius: '16px 16px 0 0', pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Gallery
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '280px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Continuous Scroll Container */}
        <motion.div
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            padding: '8px',
            x: -scrollPosition,
          }}
          transition={{ duration: 0, type: 'tween' }}
        >
          {duplicatedImages.map((image, index) => (
            <motion.div
              key={index}
              style={{
                flexShrink: 0,
                width: `${ITEM_WIDTH}px`,
                height: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Pause Indicator */}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10,
            }}
          >
            <div style={{ width: '2px', height: '10px', background: '#ffc01e', borderRadius: '1px' }} />
            <div style={{ width: '2px', height: '10px', background: '#ffc01e', borderRadius: '1px' }} />
            <span style={{ marginLeft: '4px' }}>Paused</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Achievements = () => {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeetCodeStats();
  }, []);

  const fetchLeetCodeStats = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leetcode-stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setLastUpdated(new Date(data.lastUpdated));
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      toast({
        title: "Failed to load stats",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Failed to load LeetCode stats</p>
          <button
            onClick={fetchLeetCodeStats}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { easy, medium, hard, total } = stats.problemsSolved;
  const badge = getRatingBadge(stats.contest.rating);
  const solveRate = total > 0 ? Math.round((total / 3500) * 100) : 0;

  // Gallery images - add your images here
  const galleryImages = [
    'achievement1.jpeg',
    'achievement2.jpeg',
    'achievement3.jpeg',
    'achievement4.jpeg',
    'achievement5.jpeg',
    'achievement6.jpeg',
    'achievement7.jpeg',
  ];

  const diffStats = [
    { label: 'Easy', count: easy, color: '#00b8a3', bg: 'rgba(0,184,163,0.12)', border: 'rgba(0,184,163,0.25)' },
    { label: 'Medium', count: medium, color: '#ffc01e', bg: 'rgba(255,192,30,0.12)', border: 'rgba(255,192,30,0.25)' },
    { label: 'Hard', count: hard, color: '#ef4743', bg: 'rgba(239,71,67,0.12)', border: 'rgba(239,71,67,0.25)' },
  ];

  // Contest history for chart — use real data or fallback to static demo
  const hasRealHistory = stats.contestHistory && stats.contestHistory.length > 1;
  const chartHistory: ContestHistoryEntry[] = hasRealHistory
    ? stats.contestHistory!
    : (() => {
        // Synthetic fallback derived from current rating
        const r = stats.contest.rating;
        const n = Math.max(4, stats.contest.attended);
        return Array.from({ length: Math.min(n, 10) }, (_, i) => {
          const progress = i / (Math.min(n, 10) - 1);
          const syntheticRating = r * 0.7 + r * 0.3 * progress + (Math.random() - 0.5) * 40;
          return {
            attended: true,
            rating: Math.round(syntheticRating),
            ranking: 0,
            contest: {
              title: `Contest ${i + 1}`,
              startTime: Math.floor(Date.now() / 1000) - (Math.min(n, 10) - i) * 14 * 24 * 3600,
            },
          };
        });
      })();

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-2">
            Coding <span className="text-gradient">Achievements</span>
          </h2>
          {lastUpdated && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 4 }}>
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </motion.div>

        {/* TOP ROW: Profile card + Problems solved */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>

          {/* — Profile card — */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '24px',
              backdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* glossy sheen */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              borderRadius: '16px 16px 0 0', pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              {stats.avatar ? (
                <img src={stats.avatar} alt="avatar" style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)' }} />
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,192,30,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#ffc01e', border: '2px solid rgba(255,192,30,0.3)' }}>
                  {stats.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.92)' }}>
                  {stats.realName || stats.username}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>@{stats.username}</span>
                  <a
                    href="https://leetcode.com/u/Sai_Nikhil_315/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'rgba(255,192,30,0.15)',
                      color: '#ffc01e',
                      textDecoration: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,192,30,0.3)';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(255,192,30,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,192,30,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    →
                  </a>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 20,
              background: `${badge.glow}`,
              border: `1px solid ${badge.color}44`,
              marginBottom: 20,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: badge.color, boxShadow: `0 0 6px ${badge.color}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: badge.color, letterSpacing: '0.02em' }}>{badge.label}</span>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Total Solved', value: total, color: '#fff' },
                { label: 'Submissions', value: (stats.submissions?.total || 0).toLocaleString(), color: '#fff' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* — Problems Solved donut — */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '24px',
              backdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              borderRadius: '16px 16px 0 0', pointerEvents: 'none',
            }} />

            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Problems Solved
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* donut */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <DonutChart easy={easy} medium={medium} hard={hard} total={total} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center', pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'rgba(255,255,255,0.92)', lineHeight: 1 }}>{total}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>solved</div>
                </div>
              </div>

              {/* breakdown */}
              <div style={{ flex: 1 }}>
                {diffStats.map(d => (
                  <div key={d.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, color: d.color,
                        background: d.bg, border: `1px solid ${d.border}`,
                        padding: '2px 8px', borderRadius: 6,
                      }}>{d.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{d.count}</span>
                    </div>
                    {/* progress bar */}
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${total > 0 ? (d.count / total) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        viewport={{ once: true }}
                        style={{ height: '100%', background: d.color, borderRadius: 2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE ROW: Contest stats 4 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '20px 24px',
            backdropFilter: 'blur(12px)',
            marginBottom: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            borderRadius: '16px 16px 0 0', pointerEvents: 'none',
          }} />

          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Contest Performance
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            {[
              { label: 'Rating', value: Math.round(stats.contest.rating), color: '#ffc01e', glow: 'rgba(255,192,30,0.15)' },
              { label: 'Global Rank', value: `#${stats.contest.ranking.toLocaleString()}`, color: 'rgba(255,255,255,0.85)', glow: 'rgba(255,255,255,0.05)' },
              { label: 'Contests', value: stats.contest.attended, color: 'rgba(255,255,255,0.85)', glow: 'rgba(255,255,255,0.05)' },
              { label: 'Top %', value: stats.contest.topPercentage ? `${stats.contest.topPercentage}%` : '—', color: '#00b8a3', glow: 'rgba(0,184,163,0.15)' },
            ].map((s, i) => (
              <div key={s.label} style={{
                background: s.glow,
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  viewport={{ once: true }}
                  style={{ fontSize: 22, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}
                >
                  {s.value}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image Gallery */}
        <AchievementsImageCarousel images={galleryImages} />
        
      </div>
    </div>
  );
};

export default Achievements;