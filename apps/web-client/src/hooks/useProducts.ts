import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '@repo/services';
import type { ProductFilter } from '@repo/types';
import { queryKeys } from './queryKeys';

/** Paginated product list with filters */
export function useProducts(filter?: ProductFilter) {
  return useQuery({
    queryKey: queryKeys.products.list(filter as Record<string, unknown>),
    queryFn: () => productService.getProducts(filter),
    placeholderData: keepPreviousData,
  });
}

/** Single product by slug */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productService.getProduct(slug),
    enabled: !!slug,
  });
}

/** Search products by query string */
export function useSearchProducts(q: string) {
  return useQuery({
    queryKey: queryKeys.products.search(q),
    queryFn: () => productService.getProducts({ search: q } as ProductFilter),
    enabled: q.length >= 2,
  });
}
