import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Product } from '@repo/types';
import ProductCard from './ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductCarouselProps {
  products: Product[];
  /** Autoplay interval in ms (0 = disabled) */
  autoplayDelay?: number;
}

export default function ProductCarousel({ products, autoplayDelay = 4000 }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={2}
      navigation
      pagination={{ clickable: true }}
      autoplay={autoplayDelay > 0 ? { delay: autoplayDelay, disableOnInteraction: false } : false}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
      }}
      className="product-carousel pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
