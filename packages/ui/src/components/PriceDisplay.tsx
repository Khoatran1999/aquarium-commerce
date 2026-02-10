import { cn } from '../utils/cn';

export interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  currency?: string;
  locale?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
} as const;

export function PriceDisplay({
  price,
  comparePrice,
  currency = 'VND',
  locale = 'vi-VN',
  className,
  size = 'md',
}: PriceDisplayProps) {
  const fmt = (v: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(
      v,
    );

  const hasDiscount = comparePrice != null && comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', sizeClasses[size], className)}>
      <span className={cn('font-bold', hasDiscount ? 'text-danger' : 'text-foreground')}>
        {fmt(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-muted-foreground text-sm line-through">{fmt(comparePrice)}</span>
          <span className="bg-danger/10 text-danger rounded-full px-1.5 py-0.5 text-xs font-medium">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
