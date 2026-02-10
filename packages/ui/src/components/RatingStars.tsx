import { cn } from '../utils/cn';
import { Star } from 'lucide-react';

export interface RatingStarsProps {
  value: number; // 0–5, can be fractional
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number; // review count
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

export function RatingStars({
  value,
  max = 5,
  size = 'md',
  showValue,
  count,
  interactive,
  onChange,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const isFilled = value >= starValue;
          const isHalf = !isFilled && value >= starValue - 0.5;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              className={cn(
                'transition-colors',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default',
              )}
              aria-label={`Rate ${starValue} of ${max}`}
            >
              <Star
                className={cn(
                  iconSizes[size],
                  isFilled && 'fill-accent text-accent',
                  isHalf && 'fill-accent/50 text-accent',
                  !isFilled && !isHalf && 'text-muted-foreground/30',
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-muted-foreground text-sm font-medium">{value.toFixed(1)}</span>
      )}
      {count != null && <span className="text-muted-foreground text-sm">({count})</span>}
    </div>
  );
}
