import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      ? `absolute right-2 top-2 z-10 ${sizeClass} flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:shadow-md`
      : `${sizeClass} flex items-center justify-center rounded-full border border-border transition-all hover:bg-muted`;

  return (
    <button
      onClick={handleToggle}
      className={baseClasses}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={isWishlisted ? 'filled' : 'outline'}
          className={`${iconSize} ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`}
          viewBox="0 0 24 24"
          fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </motion.svg>
      </AnimatePresence>
    </button>
  );
});

export default WishlistButton;
