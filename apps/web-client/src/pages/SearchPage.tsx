import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productService } from '@repo/services';
import type { Product } from '@repo/types';
import { Skeleton, Button } from '@repo/ui';
import { queryKeys } from '../hooks';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.products.all, 'search', q],
    queryFn: () => productService.getProducts({ search: q, limit: 20 }),
    enabled: q.length > 0,
  });

  const products: Product[] = data?.data ?? [];

  return (
    <>
      <Helmet>
        <title>{q ? `"${q}" – Search` : 'Search'} – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        {q ? (
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold">
              Search results for &ldquo;{q}&rdquo;
            </h1>
            {!isLoading && (
              <p className="text-muted-foreground mt-1 text-sm">
                {products.length} {products.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <p className="text-5xl">🔍</p>
            <h1 className="text-foreground mt-4 text-xl font-bold">Search Products</h1>
            <p className="text-muted-foreground mt-2">
              Enter a search term to find your perfect fish.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && q && products.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-5xl">🐠</p>
            <p className="text-foreground mt-3 text-lg font-semibold">No results found</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Try a different search term or browse our collection.
            </p>
            <Link to="/products">
              <Button variant="outline" className="mt-4">
                Browse All Products
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProductCard product={product} showAddToCart />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
