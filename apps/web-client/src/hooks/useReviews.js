import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@repo/services';
import { queryKeys } from './queryKeys';
/** Paginated reviews for a product */
export function useReviews(productId, params) {
    return useQuery({
        queryKey: queryKeys.reviews.byProduct(productId),
        queryFn: () => reviewService.getReviews(productId, params),
        enabled: !!productId,
    });
}
