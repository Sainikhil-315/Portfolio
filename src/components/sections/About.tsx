import { useRef } from 'react';
import SectionHeading from '@/components/ui-custom/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import Counter from '@/components/motion/Counter';
import { gsap, useGSAP, SplitText, MM } from '@/lib/gsap';
import { aboutIntro, factSheet } from '@/content/about';

const About = () => {
  const introRef = useRef<HTMLDivElement>(null);

  // scrubbed word-opacity reveal — words ink in as you read down
  useGSAP(
    () => {
      const el = introRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const split = SplitText.create(el.querySelectorAll('p'), {
          type: 'words',
          autoSplit: true,
          aria: 'auto',
          onSplit: (self) => {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(self.words, {
              opacity: 0.12,
              stagger: 0.04,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                end: 'bottom 55%',
                scrub: true,
              },
            });
          },
        });
        return () => split.revert();
      });

      mm.add(MM.reduced, () => gsap.set(el, { autoAlpha: 1 }));
    },
    { scope: introRef }
  );

  return (
    <div className="section-pad">
      <SectionHeading
        index="01"
        label="About"
        headline="Engineer of useful things"
        accentWord="useful"
      />

      <div className="page-margin grid grid-cols-12 gap-10">
        <div
          ref={introRef}
          data-split
          className="col-span-12 space-y-8 lg:col-span-6"
        >
          {aboutIntro.map((para) => (
            <p
              key={para.slice(0, 24)}
              className="font-serif text-xl leading-relaxed text-ink md:text-2xl"
              style={{ fontVariationSettings: "'opsz' 40" }}
            >
              {para}
            </p>
          ))}
        </div>

        <Reveal
          className="col-span-12 lg:col-span-5 lg:col-start-8"
          childSelector="[data-fact-row]"
        >
          <dl>
            {factSheet.map((fact) => (
              <div
                key={fact.label}
                data-fact-row
                className="hairline-b flex items-baseline justify-between gap-6 py-4"
              >
                <dt className="text-label text-ink-muted">{fact.label}</dt>
                <dd className="text-right font-mono text-sm text-ink">
                  {fact.countTo !== undefined ? (
                    <>
                      <Counter
                        to={fact.countTo}
                        decimals={fact.decimals ?? 0}
                        suffix={fact.suffix ?? ''}
                      />
                      {fact.label === 'CGPA' && (
                        <span className="text-ink-muted"> / 10.0</span>
                      )}
                    </>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </div>
  );
};

export default About;
