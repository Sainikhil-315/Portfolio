import { useState } from 'react';
import SectionHeading from '@/components/ui-custom/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import Marquee from '@/components/motion/Marquee';
import { skills, proficiencyWord, type SkillCategory } from '@/content/skills';
import { cn } from '@/lib/utils';

const CATEGORIES: Array<'All' | SkillCategory> = [
  'All',
  'Language',
  'Frontend',
  'Backend',
  'Tooling',
];

/** Editorial index table — typography instead of progress bars. */
const Skills = () => {
  const [filter, setFilter] = useState<'All' | SkillCategory>('All');

  const visible = skills.filter(
    (s) => filter === 'All' || s.category === filter
  );

  return (
    <div className="section-pad">
      <SectionHeading
        index="03"
        label="Skills"
        headline="A working vocabulary"
        accentWord="vocabulary"
      />

      {/* velocity-reactive specimen strips */}
      <div className="mb-14 space-y-3">
        <Marquee speed={34} direction={-1} className="hairline-t hairline-b py-3">
          {skills.slice(0, 9).map((s) => (
            <span
              key={s.name}
              className="text-display-lg px-6 uppercase text-ink-muted/40"
            >
              {s.name}
              <span className="px-6 text-accent/60" aria-hidden>·</span>
            </span>
          ))}
        </Marquee>
        <Marquee speed={38} direction={1} className="hairline-b py-3">
          {skills.slice(9).map((s) => (
            <span
              key={s.name}
              className="text-display-lg font-serif-italic px-6 text-ink-muted/40"
            >
              {s.name}
              <span className="px-6 text-accent/60" aria-hidden>·</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="page-margin">
        {/* mono filter tabs */}
        <div className="mb-8 flex flex-wrap gap-5" role="tablist" aria-label="Skill categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'text-label pb-1 transition-colors',
                filter === cat
                  ? 'border-b border-accent text-accent'
                  : 'text-ink-muted hover:text-ink'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* the index table */}
        <Reveal childSelector="[data-skill-row]" stagger={0.04}>
          <ol>
            {visible.map((skill, i) => (
              <li
                key={skill.name}
                data-skill-row
                className="group hairline-b relative grid grid-cols-12 items-baseline gap-4 overflow-hidden py-4 md:py-5"
              >
                {/* hover flood */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
                />
                <span className="text-label relative z-10 col-span-2 text-ink-muted transition-colors duration-300 group-hover:text-accent-ink md:col-span-1">
                  {String(i + 1).padStart(3, '0')}
                </span>
                <span className="text-display-lg relative z-10 col-span-10 text-ink transition-colors duration-300 group-hover:text-accent-ink md:col-span-6">
                  {skill.name}
                </span>
                <span className="text-label relative z-10 col-span-6 mt-1 text-ink-muted transition-colors duration-300 group-hover:text-accent-ink/80 md:col-span-3 md:mt-0">
                  {skill.category}
                </span>
                <span className="font-serif-italic relative z-10 col-span-6 mt-1 text-right text-lg text-ink transition-colors duration-300 group-hover:text-accent-ink md:col-span-2 md:mt-0 md:text-xl">
                  {proficiencyWord(skill.level)}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
};

export default Skills;
