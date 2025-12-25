import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium';
  const variants = {
    default: 'bg-surface text-text border border-border',
    outline: 'border border-border text-muted',
    success: 'bg-accent/10 text-accent border border-accent/30',
    warning: 'bg-warning/10 text-warning border border-warning/30',
  } as const;
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
