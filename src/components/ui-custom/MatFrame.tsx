import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MatFrameProps {
  children: ReactNode;
  caption?: string;
  className?: string;
  rotate?: number;
}

/**
 * Ink mat for images — dark screenshots need a frame on cream paper.
 * Mat color is fixed warm-black in both themes (it's a physical frame).
 */
const MatFrame = ({ children, caption, className, rotate = 0 }: MatFrameProps) => (
  <figure
    className={cn('inline-block', className)}
    style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
  >
    <div className="bg-[#1A1714] p-2">{children}</div>
    {caption && (
      <figcaption className="text-label mt-2 text-ink-muted">
        {caption}
      </figcaption>
    )}
  </figure>
);

export default MatFrame;
