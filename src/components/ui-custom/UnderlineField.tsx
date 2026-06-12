import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full bg-transparent border-0 border-b border-hairline rounded-none px-0 py-3 ' +
  'font-sans text-base text-ink placeholder:text-ink-muted/50 ' +
  'focus:outline-none focus:ring-0 focus:border-accent transition-colors duration-300';

interface UnderlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  index: string;
}

export const UnderlineInput = forwardRef<HTMLInputElement, UnderlineInputProps>(
  ({ label, index, id, className, ...props }, ref) => (
    <div className="group">
      <label htmlFor={id} className="text-label block text-ink-muted">
        <span className="text-accent">{index}</span> — {label}
      </label>
      <input ref={ref} id={id} className={cn(fieldBase, className)} {...props} />
    </div>
  )
);
UnderlineInput.displayName = 'UnderlineInput';

interface UnderlineTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  index: string;
}

export const UnderlineTextarea = forwardRef<
  HTMLTextAreaElement,
  UnderlineTextareaProps
>(({ label, index, id, className, ...props }, ref) => (
  <div className="group">
    <label htmlFor={id} className="text-label block text-ink-muted">
      <span className="text-accent">{index}</span> — {label}
    </label>
    <textarea
      ref={ref}
      id={id}
      className={cn(fieldBase, 'resize-none', className)}
      {...props}
    />
  </div>
));
UnderlineTextarea.displayName = 'UnderlineTextarea';
