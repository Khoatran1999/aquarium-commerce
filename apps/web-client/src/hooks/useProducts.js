import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '@repo/services';
import { queryKeys } from './queryKeys';
/** Paginated product list with filters */
export function useProducts(filter) {
    return useQuery({
        queryKey: queryKeys.products.list(filter),
        queryFn: () => productService.getProducts(filter),
        placeholderData: keepPreviousData,
    });
}
/** Single product by slug */
export function useProduct(slug) {
    return useQuery({
        queryKey: queryKeys.products.detail(slug),
        queryFn: () => productService.getProduct(slug),
        enabled: !!slug,
    });
}
/** Search products by query string */
export function useSearchProducts(q) {
    return useQuery({
        queryKey: queryKeys.products.search(q),
        queryFn: () => productService.getProducts({ search: q }),
        enabled: q.length >= 2,
    });
}
