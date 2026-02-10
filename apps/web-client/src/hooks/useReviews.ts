import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@repo/services';
import { queryKeys } from './queryKeys';

/** Paginated reviews for a product */
export function useReviews(productId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () => reviewService.getReviews(productId, params),
    enabled: !!productId,
  });
}
