import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@repo/services';
import { queryKeys } from './queryKeys';
import { useAppSelector } from '../store';

/** Full wishlist (paginated, with product details) */
export function useWishlist(params?: { page?: number; limit?: number }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return useQuery({
    queryKey: queryKeys.wishlist.list(),
    queryFn: () => wishlistService.getWishlist(params),
    enabled: isAuthenticated,
  });
}

/** All wishlisted product IDs — for batch UI checking */
export function useWishlistIds() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return useQuery({
    queryKey: queryKeys.wishlist.ids(),
    queryFn: () => wishlistService.getWishlistIds(),
    enabled: isAuthenticated,
  });
}

/** Toggle wishlist — add or remove */
export function useToggleWishlist() {
  const qc = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });

  return { addMutation, removeMutation };
}
