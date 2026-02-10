import { cn } from '../utils/cn';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled,
  className,
}: QuantitySelectorProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className={cn('inline-flex items-center', className)}>
      <button
        type="button"
        onClick={() => canDecrease && onChange(value - 1)}
        disabled={disabled || !canDecrease}
        aria-label="Decrease quantity"
        className={cn(
          'border-border flex h-9 w-9 items-center justify-center rounded-l-lg border transition-colors',
          'hover:bg-muted disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <div className="border-border flex h-9 w-12 items-center justify-center border-y text-sm font-medium">
        {value}
      </div>
      <button
        type="button"
        onClick={() => canIncrease && onChange(value + 1)}
        disabled={disabled || !canIncrease}
        aria-label="Increase quantity"
        className={cn(
          'border-border flex h-9 w-9 items-center justify-center rounded-r-lg border transition-colors',
          'hover:bg-muted disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
