import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(({ className, pressed = false, children, ...props }, ref) => (
  <button
    ref={ref}
    aria-pressed={pressed}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      pressed ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text hover:border-accent/60',
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
Toggle.displayName = 'Toggle';
