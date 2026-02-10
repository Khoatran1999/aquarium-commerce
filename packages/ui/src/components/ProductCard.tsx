import { cn } from '../utils/cn';
import type { Product } from '@repo/types';
import { PriceDisplay } from './PriceDisplay';
import { RatingStars } from './RatingStars';
import { Badge } from './Badge';

export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const isOutOfStock = product.available <= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border-border group relative overflow-hidden rounded-xl border transition-all duration-200',
        onClick && 'hover:shadow-card cursor-pointer hover:-translate-y-0.5',
        className,
      )}
    >
      {/* Image */}
      <div className="bg-muted relative aspect-square overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.comparePrice != null && product.comparePrice > product.price && (
            <Badge variant="danger">Sale</Badge>
          )}
          {isOutOfStock && <Badge variant="default">Out of stock</Badge>}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        {product.species && (
          <span className="text-muted-foreground text-xs uppercase tracking-wide">
            {product.species.name}
          </span>
        )}
        <h3 className="text-foreground line-clamp-2 text-sm font-semibold leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <RatingStars value={product.avgRating} size="sm" count={product.reviewCount} />
        )}

        {/* Price */}
        <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="sm" />

        {/* Stock indicator */}
        {!isOutOfStock && product.available <= 5 && (
          <span className="text-warning text-xs">Only {product.available} left</span>
        )}
      </div>
    </div>
  );
}
