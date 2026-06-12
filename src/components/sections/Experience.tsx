import { useRef } from 'react';
import SectionHeading from '@/components/ui-custom/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { gsap, useGSAP, MM } from '@/lib/gsap';
import { experiences } from '@/content/experience';

const Experience = () => {
  const ref = useRef<HTMLDivElement>(null);

  // vertical rule draws down the ledger as it scrolls through
  useGSAP(
    () => {
      const rule = ref.current?.querySelector('[data-exp-rule]');
      if (!rule) return;
      const mm = gsap.matchMedia();

      mm.add(`${MM.motionOK} and ${MM.isDesktop}`, () => {
        gsap.fromTo(
          rule,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="section-pad">
      <SectionHeading
        index="02"
        label="Experience"
        headline="Where I've worked"
        accentWord="worked"
      />

      <div className="page-margin relative">
        <span
          data-exp-rule
          className="absolute bottom-0 left-0 top-0 hidden w-px bg-accent md:block"
          aria-hidden
        />

        {experiences.map((exp) => (
          <Reveal
            key={exp.company + exp.period}
            className="hairline-b py-10 md:pl-12 md:py-14"
          >
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-3">
                <span className="text-label text-ink-muted">{exp.period}</span>
                <p className="text-label mt-2 text-ink-muted/70">
                  {exp.location}
                </p>
              </div>

              <div className="col-span-12 md:col-span-9">
                <h3 className="text-display-lg text-ink">
                  {exp.title}{' '}
                  <span className="font-serif-italic text-accent">
                    @ {exp.company}
                  </span>
                </h3>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {exp.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {exp.achievements.map((a) => (
                    <li
                      key={a}
                      className="flex items-baseline gap-3 text-sm text-ink"
                    >
                      <span className="text-accent" aria-hidden>
                        —
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>

                <p className="text-label mt-8 text-ink-muted">
                  {exp.technologies.join(' · ')}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Experience;
