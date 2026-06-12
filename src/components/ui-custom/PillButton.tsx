import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Magnetic from '@/components/motion/Magnetic';
import { cn } from '@/lib/utils';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'ink' | 'accent' | 'outline';
  magnetic?: boolean;
}

/** Ink pill button with sliding-fill hover. Sharp site, round buttons — on purpose. */
const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ children, className, variant = 'ink', magnetic = true, ...props }, ref) => {
    const btn = (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5',
          'font-sans text-sm font-medium tracking-tight transition-colors duration-300',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'ink' &&
            'bg-ink text-paper hover:text-paper',
          variant === 'accent' &&
            'bg-accent text-accent-ink hover:text-accent-ink',
          variant === 'outline' &&
            'border border-ink/30 text-ink hover:border-transparent hover:text-paper',
          className
        )}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 -z-0 translate-y-full rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0',
            variant === 'ink' && 'bg-accent',
            variant === 'accent' && 'bg-ink',
            variant === 'outline' && 'bg-ink'
          )}
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );

    return magnetic ? <Magnetic>{btn}</Magnetic> : btn;
  }
);
PillButton.displayName = 'PillButton';

export default PillButton;
