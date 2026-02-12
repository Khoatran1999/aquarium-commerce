import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button } from '@repo/ui';
import type { Product } from '@repo/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  /** Show "Add to Cart" button (default: false) */
  showAddToCart?: boolean;
}

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
      dispatch(addToCart({ productId: product.id, quantity: 1 }));
      toast.success(`${product.name} added to cart`);
    },
    [dispatch, product.id, product.name],
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
          <div className="bg-muted flex h-full w-full items-center justify-center text-4xl">🐟</div>
        )}
        {hasDiscount && (
          <span className="bg-danger absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white">
            -{Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}%
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-muted-foreground text-xs">{product.species?.name}</p>
        <h3 className="text-foreground mt-1 line-clamp-1 text-sm font-semibold">{product.name}</h3>
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
            <span className="text-accent text-xs">★</span>
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
