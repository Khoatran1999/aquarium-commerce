import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { addWishlistItem, removeWishlistItem } from '../store/wishlist.slice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
  productId: string;
  /** Visual variant */
  variant?: 'overlay' | 'inline';
  /** Button size class */
  size?: 'sm' | 'md';
}

/**
 * Heart-icon toggle button for wishlist.
 * - `overlay`: absolute-positioned, used on ProductCard image
 * - `inline`: normal flow, used on ProductDetailPage
 */
const WishlistButton = memo(function WishlistButton({
  productId,
  variant = 'overlay',
  size = 'sm',
}: WishlistButtonProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const isWishlisted = useAppSelector((s) => s.wishlist.ids.includes(productId));

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast('Please sign in to save to wishlist', { icon: '🔒' });
        navigate('/login');
        return;
      }

      if (isWishlisted) {
        dispatch(removeWishlistItem(productId));
        toast.success('Removed from wishlist');
      } else {
        dispatch(addWishlistItem(productId));
        toast.success('Added to wishlist');
      }
    },
    [dispatch, isAuthenticated, isWishlisted, navigate, productId],
  );

  const sizeClass = size === 'md' ? 'h-10 w-10' : 'h-8 w-8';
  const iconSize = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  const baseClasses =
    variant === 'overlay'
      ? `absolute right-2 top-2 z-10 ${sizeClass} flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm transition-all hover:bg-card hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`
      : `${sizeClass} flex items-center justify-center rounded-full border border-border transition-all hover:bg-muted cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`;

  return (
    <button
      onClick={handleToggle}
      className={baseClasses}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isWishlisted ? 'filled' : 'outline'}
          className={`${iconSize} ${isWishlisted ? 'text-secondary' : 'text-muted-foreground'}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className="h-full w-full"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
});

export default WishlistButton;
