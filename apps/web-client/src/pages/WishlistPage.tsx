import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Fish } from 'lucide-react';
import { useWishlist, queryKeys } from '../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../store';
import { removeWishlistItem } from '../store/wishlist.slice';
import { Skeleton, Button } from '@repo/ui';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: res, isLoading } = useWishlist({ limit: 50 });
  const items = res?.data ?? [];
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    dispatch(removeWishlistItem(productId))
      .unwrap()
      .then(() => {
        toast.success('Removed from wishlist');
        // Invalidate TanStack Query cache so the list re-fetches
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      })
      .catch(() => toast.error('Failed to remove'))
      .finally(() => setRemovingId(null));
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist – AquaLuxe</title>
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <h1 className="text-foreground mb-8 text-3xl font-bold">My Wishlist</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4">
                <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="mb-4">
              <Heart size={56} className="text-red-400" />
            </div>
            <h2 className="text-foreground mb-2 text-xl font-semibold">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save your favorite fish to come back to them later.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const img =
                  product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-card border-border shadow-card group relative overflow-hidden rounded-2xl border">
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(product.id)}
                        disabled={removingId === product.id}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:shadow-md"
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>

                      <Link to={`/products/${product.slug}`}>
                        <div className="aspect-square overflow-hidden">
                          {img ? (
                            <img
                              src={img}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="bg-muted flex h-full w-full items-center justify-center">
                              <Fish size={40} className="text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-muted-foreground text-xs">{product.species?.name}</p>
                          <h3 className="text-foreground mt-1 line-clamp-1 text-sm font-semibold">
                            {product.name}
                          </h3>
                          <span className="text-primary mt-2 block text-lg font-bold">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
