import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Fish, ShoppingCart, Star } from 'lucide-react';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cart.slice';
import type { Product } from '@repo/types';
import toast from 'react-hot-toast';
import WishlistButton from './WishlistButton';
import { useCartFly } from '../context/CartFlyContext';

interface ProductCardProps {
  product: Product;
  /** Show "Add to Cart" button (default: false) */
  showAddToCart?: boolean;
}

const careLevelConfig: Record<string, { label: string; className: string }> = {
  EASY:     { label: 'Easy',     className: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-700/30' },
  MODERATE: { label: 'Moderate', className: 'bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-700/30' },
  HARD:     { label: 'Hard',     className: 'bg-orange-50 text-orange-700 ring-orange-200/60 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-700/30' },
  EXPERT:   { label: 'Expert',   className: 'bg-red-50 text-red-700 ring-red-200/60 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-700/30' },
};

const ProductCard = memo(function ProductCard({
  product,
  showAddToCart = false,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { triggerFly } = useCartFly();
  const img = product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url;

  const handleAdd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      triggerFly(e.currentTarget.getBoundingClientRect());
      dispatch(addToCart({ productId: product.id, quantity: 1, product }));
      toast.success(`${product.name} added to cart`);
    },
    [dispatch, product, triggerFly],
  );

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;
  const careConf = product.species?.careLevel ? careLevelConfig[product.species.careLevel] : null;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {img ? (
          <>
            <img
              src={img}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Fish size={44} className="text-border" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-white shadow-md">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist button */}
        <WishlistButton productId={product.id} variant="overlay" size="sm" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Species name */}
        <p className="mb-0.5 text-xs font-medium text-muted-foreground">
          {product.species?.name ?? '\u00A0'}
        </p>

        {/* Product name */}
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
          {product.name}
        </h3>

        {/* Badges */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {careConf && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${careConf.className}`}>
              {careConf.label}
            </span>
          )}
          {product.size && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-border/60">
              Size {product.size}
            </span>
          )}
        </div>

        <div className="flex-1" />

        {/* Price row */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black text-primary">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.comparePrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <Star size={11} className="fill-accent text-accent" />
            <span className="text-xs font-semibold text-foreground">
              {product.avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Add to Cart row */}
        {showAddToCart && (
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className={`text-xs font-medium ${product.available > 0 ? 'text-success' : 'text-muted-foreground'}`}>
              {product.available > 0 ? `${product.available} in stock` : 'Out of stock'}
            </span>
            <button
              onClick={handleAdd}
              disabled={product.available <= 0}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-elevated hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none dark:text-background"
            >
              <ShoppingCart size={12} />
              {product.available > 0 ? 'Add' : 'Sold Out'}
            </button>
          </div>
        )}
      </div>
    </Link>
  );
});

export default ProductCard;
