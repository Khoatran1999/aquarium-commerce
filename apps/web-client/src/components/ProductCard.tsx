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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#CCE0ED] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0094C4]/40 hover:shadow-[0_8px_32px_rgba(0,148,196,0.18)] dark:border-[#0D2C45] dark:bg-[#041628] dark:hover:border-[#00CCEE]/30 dark:hover:shadow-[0_8px_32px_rgba(0,204,238,0.18)]"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-[#E4EFF8] dark:bg-[#071F36]">
        {img ? (
          <>
            <img
              src={img}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
            />
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Fish size={44} className="text-[#CCE0ED] dark:text-[#0D2C45]" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FF5252] px-2.5 py-1 text-[10px] font-bold text-white shadow-md dark:bg-[#FF6B6B]">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist button */}
        <WishlistButton productId={product.id} variant="overlay" size="sm" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Species name */}
        <p className="mb-0.5 text-xs font-medium text-[#547698] dark:text-[#6496B8]">
          {product.species?.name ?? '\u00A0'}
        </p>

        {/* Product name */}
        <h3 className="line-clamp-1 text-sm font-semibold text-[#0A1825] dark:text-[#D6EAFF]">
          {product.name}
        </h3>

        {/* Badges */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {careConf && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${careConf.className}`}>
              {careConf.label}
            </span>
          )}
          {product.size && (
            <span className="inline-flex items-center rounded-full bg-[#E4EFF8] px-2 py-0.5 text-[10px] font-semibold text-[#0094C4] ring-1 ring-[#CCE0ED]/60 dark:bg-[#071F36] dark:text-[#55DDFF] dark:ring-[#0D2C45]/60">
              Size {product.size}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black text-[#0094C4] dark:text-[#00CCEE]">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#547698] line-through dark:text-[#6496B8]">
              ${product.comparePrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <Star size={11} className="fill-[#FFB300] text-[#FFB300]" />
            <span className="text-xs font-semibold text-[#0A1825] dark:text-[#D6EAFF]">
              {product.avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-[#547698] dark:text-[#6496B8]">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Add to Cart row */}
        {showAddToCart && (
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className={`text-xs font-medium ${product.available > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#547698] dark:text-[#6496B8]'}`}>
              {product.available > 0 ? `${product.available} in stock` : 'Out of stock'}
            </span>
            <button
              onClick={handleAdd}
              disabled={product.available <= 0}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0094C4] to-[#0077A3] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,148,196,0.4)] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none dark:from-[#00CCEE] dark:to-[#0094C4] dark:text-[#000F1E]"
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
