import SectionHeading from '@/components/ui-custom/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import Counter from '@/components/motion/Counter';
import Marquee from '@/components/motion/Marquee';
import MatFrame from '@/components/ui-custom/MatFrame';
import SolvedBar from '@/components/charts/SolvedBar';
import RatingChart from '@/components/charts/RatingChart';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { achievementGallery } from '@/content/projects';

/** LeetCode rating tiers — thresholds preserved from the old implementation. */
const getRatingTier = (rating: number) => {
  if (rating >= 2400) return { label: 'Guardian', color: '#ff2d2d' };
  if (rating >= 2100) return { label: 'Knight', color: '#ff7500' };
  if (rating >= 1600) return { label: 'Expert', color: '#2196f3' };
  if (rating >= 1200) return { label: 'Specialist', color: '#03a89e' };
  return { label: 'Newcomer', color: 'hsl(var(--ink-muted))' };
};

const Achievements = () => {
  const { data, isLoading, isError, refetch } = useLeetCodeStats();
  const stats = data?.data;
  const lastUpdated = data?.lastUpdated ? new Date(data.lastUpdated) : null;

  return (
    <div className="section-pad">
      <SectionHeading
        index="05"
        label="Achievements"
        headline="The ledger"
        accentWord="ledger"
      />

      <div className="page-margin">
        {isLoading && (
          <p className="text-label py-16 text-center text-ink-muted">
            Syncing with LeetCode…
          </p>
        )}

        {isError && (
          <div className="py-16 text-center">
            <p className="text-label mb-6 text-ink-muted">
              Failed to load LeetCode stats
            </p>
            <button
              onClick={() => refetch()}
              className="text-label rounded-full border border-hairline px-5 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Retry ↻
            </button>
          </div>
        )}

        {stats && (
          <>
            {/* profile row */}
            <Reveal className="hairline-b flex flex-wrap items-center justify-between gap-6 pb-8">
              <div className="flex items-center gap-5">
                {stats.avatar && (
                  <MatFrame>
                    <img
                      src={stats.avatar}
                      alt={`${stats.username} avatar`}
                      className="h-14 w-14 object-cover"
                    />
                  </MatFrame>
                )}
                <div>
                  <p className="font-serif text-2xl text-ink">
                    {stats.realName || stats.username}
                  </p>
                  <a
                    href={`https://leetcode.com/u/${stats.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label text-ink-muted transition-colors hover:text-accent"
                  >
                    @{stats.username} ↗
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <span
                  className="font-serif-italic text-3xl"
                  style={{ color: getRatingTier(stats.contest.rating).color }}
                >
                  {getRatingTier(stats.contest.rating).label}
                </span>
                {lastUpdated && (
                  <span className="text-label hidden text-ink-muted md:block">
                    Last synced — {lastUpdated.toLocaleDateString()}
                  </span>
                )}
              </div>
            </Reveal>

            {/* big-stat band */}
            <Reveal
              className="grid grid-cols-2 md:grid-cols-4"
              childSelector="[data-stat-cell]"
            >
              {[
                {
                  label: 'Contest Rating',
                  value: (
                    <Counter to={Math.round(stats.contest.rating)} />
                  ),
                },
                {
                  label: 'Global Rank',
                  value: <Counter to={stats.contest.ranking} prefix="#" />,
                },
                {
                  label: 'Contests',
                  value: <Counter to={stats.contest.attended} />,
                },
                {
                  label: 'Top Percentage',
                  value: stats.contest.topPercentage ? (
                    <Counter
                      to={stats.contest.topPercentage}
                      decimals={1}
                      suffix="%"
                    />
                  ) : (
                    <span>—</span>
                  ),
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  data-stat-cell
                  className={`flex flex-col gap-1 py-6 pr-6 ${i > 0 ? 'md:border-l md:border-hairline md:pl-6' : ''}`}
                >
                  <span className="text-display-lg text-ink">{s.value}</span>
                  <span className="text-label text-ink-muted">{s.label}</span>
                </div>
              ))}
            </Reveal>

            {/* solved breakdown + rating chart */}
            <div className="hairline-t mt-4 grid grid-cols-12 gap-12 pt-10">
              <Reveal className="col-span-12 lg:col-span-5">
                <div className="mb-6 flex items-baseline justify-between">
                  <span className="text-display-lg text-ink">
                    <Counter to={stats.problemsSolved.total} />{' '}
                    <span className="font-serif-italic text-accent">solved</span>
                  </span>
                  <span className="text-label text-ink-muted">
                    {stats.submissions.total.toLocaleString()} submissions
                  </span>
                </div>
                <SolvedBar
                  easy={stats.problemsSolved.easy}
                  medium={stats.problemsSolved.medium}
                  hard={stats.problemsSolved.hard}
                  total={stats.problemsSolved.total}
                />
              </Reveal>

              <Reveal className="col-span-12 lg:col-span-7">
                <p className="text-label mb-6 text-ink-muted">
                  Contest rating — history
                </p>
                <RatingChart history={stats.contestHistory ?? []} />
              </Reveal>
            </div>
          </>
        )}

        {/* certificates / gallery filmstrip — independent of API state */}
      </div>

      <div className="mt-16">
        <p className="text-label page-margin mb-5 text-ink-muted">
          Gallery — hackathons & certificates
        </p>
        <Marquee
          speed={45}
          pauseOnHover
          data-cursor="drag"
          className="hairline-t hairline-b py-6"
        >
          {achievementGallery.map((img) => (
            <div key={img.src} className="px-3">
              <MatFrame caption={img.caption}>
                <img
                  src={img.src}
                  alt={`Achievement ${img.caption}`}
                  className="h-52 w-72 object-cover"
                  loading="lazy"
                />
              </MatFrame>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Achievements;
