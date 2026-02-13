import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Fish } from 'lucide-react';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button } from '@repo/ui';
import type { Product } from '@repo/types';
import toast from 'react-hot-toast';
import WishlistButton from './WishlistButton';
import { StarRating } from './icons';

interface ProductCardProps {
  product: Product;
  /** Show "Add to Cart" button (default: false) */
  showAddToCart?: boolean;
}

const careLevelStyles: Record<string, string> = {
  EASY: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  MODERATE: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  HARD: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  EXPERT: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

/**
 * Shared product card used across HomePage, ProductListingPage, SearchPage.
 * Wrapped with React.memo to prevent unnecessary re-renders in large lists.
 */
const ProductCard = memo(function ProductCard({
  product,
  showAddToCart = false,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const img = product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url;

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(addToCart({ productId: product.id, quantity: 1, product }));
      toast.success(`${product.name} added to cart`);
    },
    [dispatch, product],
  );

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-card border-border shadow-card hover:shadow-elevated group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <Fish size={48} className="text-muted-foreground/40" />
          </div>
        )}
        {hasDiscount && (
          <span className="bg-danger absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white">
            -{Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}%
          </span>
        )}
        <WishlistButton productId={product.id} variant="overlay" size="sm" />
      </div>

      <div className="p-4">
        <p className="text-muted-foreground text-xs">{product.species?.name}</p>
        <h3 className="text-foreground mt-1 line-clamp-1 text-sm font-semibold">{product.name}</h3>

        {/* Care Level & Size badges */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.species?.careLevel && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${careLevelStyles[product.species.careLevel] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {product.species.careLevel.charAt(0) +
                product.species.careLevel.slice(1).toLowerCase()}
            </span>
          )}
          {product.size && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Size: {product.size}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-primary text-lg font-bold">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-muted-foreground text-xs line-through">
              ${product.comparePrice!.toFixed(2)}
            </span>
          )}
        </div>

        {product.avgRating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <StarRating rating={1} max={1} size={12} />
            <span className="text-muted-foreground text-xs">
              {product.avgRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {showAddToCart && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              {product.available > 0 ? `${product.available} in stock` : 'Out of stock'}
            </span>
            <Button size="sm" onClick={handleAdd} disabled={product.available <= 0}>
              {product.available > 0 ? 'Add to Cart' : 'Sold Out'}
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
});

export default ProductCard;
