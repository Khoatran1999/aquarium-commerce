import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks';
import { Skeleton } from '@repo/ui';
import ProductCarousel from './ProductCarousel';

export default function NewArrivalsSection() {
  const { data: res, isLoading } = useProducts({ sortBy: 'newest', limit: 12 });
  const products = res?.data ?? [];

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
      <motion.div
        className="mb-10 flex items-end justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-foreground text-3xl font-bold">New Arrivals</h2>
          <p className="text-muted-foreground mt-2">Recently added to our collection</p>
        </div>
        <Link
          to="/products?sortBy=newest"
          className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors"
        >
          View All →
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4">
              <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <ProductCarousel products={products} autoplayDelay={5000} />
      )}
    </section>
  );
}
