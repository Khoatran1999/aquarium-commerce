import { cn } from '../utils/cn';

export interface ProgressProps {
  value: number; // 0–100
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('bg-muted relative h-2 w-full overflow-hidden rounded-full', className)}
    >
      <div
        className={cn('bg-primary h-full transition-all duration-300 ease-out', indicatorClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
