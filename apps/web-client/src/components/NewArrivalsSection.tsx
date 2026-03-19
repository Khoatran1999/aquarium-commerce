/**
 * NewArrivalsSection
 * - Header animated with GSAP ScrollTrigger
 * - Carousel powered by GSAP (via GsapCarousel)
 */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks';
import { Skeleton } from '@repo/ui';
import ProductCarousel from './ProductCarousel';

gsap.registerPlugin(ScrollTrigger);

export default function NewArrivalsSection() {
  const { data: res, isLoading } = useProducts({ sortBy: 'newest', limit: 12 });
  const products = res?.data ?? [];

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      })
        .fromTo(labelRef.current,   { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' })
        .fromTo(titleRef.current,   { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.24')
        .fromTo(subtitleRef.current,{ opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.22')
        .fromTo(linkRef.current,    { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.38, ease: 'power2.out' }, '-=0.28');
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section ref={sectionRef} className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p ref={labelRef} className="mb-1 text-xs font-bold uppercase tracking-widest text-[#0094C4] opacity-0 dark:text-[#00CCEE]">
            Just In
          </p>
          <h2 ref={titleRef} className="text-3xl font-bold text-[#0A1825] opacity-0 dark:text-[#D6EAFF] md:text-4xl">
            New Arrivals
          </h2>
          <p ref={subtitleRef} className="mt-1.5 text-sm text-[#547698] opacity-0 dark:text-[#6496B8]">
            Recently added to our collection
          </p>
        </div>
        <Link
          ref={linkRef}
          to="/products?sortBy=newest"
          className="group hidden items-center gap-1.5 text-sm font-semibold text-[#0094C4] opacity-0 transition-colors hover:text-[#0077A3] dark:text-[#00CCEE] dark:hover:text-[#55DDFF] sm:flex"
        >
          View All
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 dark:bg-[#041628]">
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
