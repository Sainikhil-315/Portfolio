import SplitTextReveal from '@/components/motion/SplitTextReveal';
import Reveal from '@/components/motion/Reveal';

interface SectionHeadingProps {
  index: string;
  label: string;
  headline: string;
  /** word to render in accent italic, must appear in headline */
  accentWord?: string;
}

/** The section ritual: hairline → mono index + label → oversized headline. */
const SectionHeading = ({
  index,
  label,
  headline,
  accentWord,
}: SectionHeadingProps) => {
  const parts = accentWord ? headline.split(accentWord) : [headline];

  return (
    <header className="hairline-t page-margin pt-6 pb-12 md:pb-16">
      <Reveal className="flex items-baseline gap-4">
        <span className="text-label text-accent">{index}</span>
        <span className="text-label text-ink-muted">{label}</span>
      </Reveal>
      <SplitTextReveal
        as="h2"
        type="lines"
        className="text-display-xl mt-6 text-ink"
      >
        {accentWord && parts.length === 2 ? (
          <>
            {parts[0]}
            <em className="font-serif-italic text-accent">{accentWord}</em>
            {parts[1]}
          </>
        ) : (
          headline
        )}
      </SplitTextReveal>
    </header>
  );
};

export default SectionHeading;
