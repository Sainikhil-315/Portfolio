import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ClipReveal from '@/components/motion/ClipReveal';
import Counter from '@/components/motion/Counter';
import Marquee from '@/components/motion/Marquee';
import MatFrame from '@/components/ui-custom/MatFrame';
import PillButton from '@/components/ui-custom/PillButton';
import { gsap, useGSAP, MM } from '@/lib/gsap';
import { onReveal } from '@/lib/animationGate';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { site, socials } from '@/content/site';

const HeroScene = lazy(() => import('@/components/webgl/HeroScene'));

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useLeetCodeStats();
  const [mountScene, setMountScene] = useState(false);

  const solved = data?.data.problemsSolved.total;
  const rating = data?.data.contest.rating
    ? Math.floor(data.data.contest.rating)
    : undefined;

  // mount WebGL after the reveal so it never competes with the preloader
  useEffect(() => onReveal(() => setMountScene(true)), []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const items = el.querySelectorAll('[data-hero-fade]');
        gsap.set(items, { autoAlpha: 0, y: 24 });
        onReveal(() => {
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.08,
            delay: 0.55,
          });
        });
      });

      mm.add(MM.reduced, () => {
        gsap.set(el.querySelectorAll('[data-hero-fade]'), {
          autoAlpha: 1,
          y: 0,
        });
      });
    },
    { scope: ref }
  );

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = site.resumePath;
    link.download = 'Sai_Nikhil_Mullapudi_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={ref} className="relative flex min-h-screen flex-col justify-end overflow-hidden pt-24">
      {/* WebGL particle field behind the type */}
      {mountScene && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0" aria-hidden>
            <HeroScene />
          </div>
        </Suspense>
      )}

      <div className="page-margin relative z-10">
        <p data-hero-fade className="text-label mb-6 text-ink-muted">
          {site.roleLine}
        </p>

        <div className="grid grid-cols-12 items-end gap-6">
          <h1 className="col-span-12 lg:col-span-9">
            <SplitTextReveal
              as="span"
              type="chars"
              trigger="gate"
              delay={0.35}
              rotate={3}
              className="text-display-2xl block uppercase text-ink"
            >
              Sai Nikhil
            </SplitTextReveal>
            <SplitTextReveal
              as="span"
              type="chars"
              trigger="gate"
              delay={0.5}
              rotate={3}
              className="text-display-2xl font-serif-italic block text-accent"
            >
              Mullapudi
            </SplitTextReveal>
          </h1>

          <div className="col-span-12 mb-2 hidden justify-end lg:col-span-3 lg:flex">
            <ClipReveal trigger="gate" delay={0.7}>
              <MatFrame caption={`Bhimavaram, IN`} rotate={-2}>
                <img
                  src={site.portrait}
                  alt={site.name}
                  className="h-44 w-36 object-cover xl:h-52 xl:w-44"
                  loading="eager"
                />
              </MatFrame>
            </ClipReveal>
          </div>
        </div>

        {/* stats strip */}
        <div
          data-hero-fade
          className="hairline-t mt-10 grid grid-cols-2 md:grid-cols-4"
        >
          {[
            { value: <Counter to={200} suffix="+" trigger="gate" />, label: 'Contributions' },
            { value: <Counter to={22} trigger="gate" />, label: 'Repositories' },
            {
              value:
                solved !== undefined ? (
                  <Counter to={solved} trigger="gate" />
                ) : (
                  <span className="text-ink-muted">—</span>
                ),
              label: 'LeetCode Problems',
            },
            {
              value:
                rating !== undefined ? (
                  <Counter to={rating} trigger="gate" />
                ) : (
                  <span className="text-ink-muted">—</span>
                ),
              label: 'Contest Rating',
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 py-5 pr-6 ${i > 0 ? 'md:border-l md:border-hairline md:pl-6' : ''}`}
            >
              <span className="text-display-lg text-ink">{stat.value}</span>
              <span className="text-label text-ink-muted">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div
          data-hero-fade
          className="hairline-t flex flex-wrap items-center justify-between gap-6 py-6"
        >
          <PillButton onClick={downloadResume}>
            Download Resume <span aria-hidden>↓</span>
          </PillButton>
          <div className="flex flex-wrap gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label text-ink-muted transition-colors hover:text-accent"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <span className="text-label hidden text-ink-muted md:block">
            ( SCROLL )
          </span>
        </div>
      </div>

      {/* marquee strip */}
      <div data-hero-fade className="relative z-10">
        <Marquee speed={28} className="hairline-t hairline-b py-3">
          {site.marquee.map((item) => (
            <span
              key={item}
              className="px-6 font-sans text-sm font-medium uppercase tracking-[0.12em] text-ink-muted"
            >
              {item} <span className="ml-6 text-accent">·</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Hero;
