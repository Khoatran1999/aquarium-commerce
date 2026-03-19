/**
 * ProductCarousel — thin wrapper around GsapCarousel.
 * Migrated from Swiper to fully GSAP-powered carousel.
 */
import type { Product } from '@repo/types';
import GsapCarousel from './GsapCarousel';

interface ProductCarouselProps {
  products: Product[];
  autoplayDelay?: number;
}

export default function ProductCarousel({ products, autoplayDelay = 4000 }: ProductCarouselProps) {
  return <GsapCarousel products={products} autoplayDelay={autoplayDelay} />;
}
