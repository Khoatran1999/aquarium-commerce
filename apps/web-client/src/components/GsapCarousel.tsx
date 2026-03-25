/**
 * GsapCarousel — a fully GSAP-powered product carousel.
 * Replaces Swiper for smooth, GPU-accelerated slides with
 * auto-play, pause-on-hover, touch/drag support, and dot navigation.
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@repo/types';
import ProductCard from './ProductCard';

gsap.registerPlugin(Draggable);

const GAP = 20; // px gap between slides

function getSpv(): number {
  if (typeof window === 'undefined') return 2;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 768) return 3;
  return 2;
}

interface GsapCarouselProps {
  products: Product[];
  autoplayDelay?: number; // ms, 0 = off
}

export default function GsapCarousel({ products, autoplayDelay = 4000 }: GsapCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const autoplayRef = useRef<ReturnType<typeof gsap.delayedCall> | null>(null);
  const isPausedRef = useRef(false);
  const currentIndexRef = useRef(0);
  const spvRef = useRef(getSpv());

  const [current, setCurrent] = useState(0);
  const [spv, setSpv] = useState(getSpv);

  const maxIndex = Math.max(0, products.length - spv);
  const dotCount = maxIndex + 1;

  /* ── Animate dots ─── */
  const animateDots = useCallback((idx: number) => {
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      gsap.to(dot, {
        scale: i === idx ? 1.5 : 1,
        opacity: i === idx ? 1 : 0.4,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  }, []);

  /* ── Core scroll function ─── */
  const scrollTo = useCallback(
    (idx: number, animate = true) => {
      if (!containerRef.current || !trackRef.current) return;
      const clamped = Math.max(0, Math.min(idx, Math.max(0, products.length - spvRef.current)));
      currentIndexRef.current = clamped;
      setCurrent(clamped);
      animateDots(clamped);

      const containerWidth = containerRef.current.offsetWidth;
      const slideWidth = (containerWidth - GAP * (spvRef.current - 1)) / spvRef.current;
      const x = -(clamped * (slideWidth + GAP));

      if (animate) {
        gsap.to(trackRef.current, { x, duration: 0.65, ease: 'power3.out' });
      } else {
        gsap.set(trackRef.current, { x });
      }
    },
    [products.length, animateDots],
  );

  /* ── Navigation ─── */
  const next = useCallback(() => {
    const nx = currentIndexRef.current >= Math.max(0, products.length - spvRef.current) ? 0 : currentIndexRef.current + 1;
    scrollTo(nx);
  }, [scrollTo, products.length]);

  const prev = useCallback(() => {
    const mx = Math.max(0, products.length - spvRef.current);
    const px = currentIndexRef.current <= 0 ? mx : currentIndexRef.current - 1;
    scrollTo(px);
  }, [scrollTo, products.length]);

  /* ── Autoplay via GSAP delayedCall ─── */
  const scheduleNext = useCallback(() => {
    if (autoplayRef.current) autoplayRef.current.kill();
    if (autoplayDelay <= 0 || products.length <= spvRef.current || isPausedRef.current) return;
    autoplayRef.current = gsap.delayedCall(autoplayDelay / 1000, () => {
      next();
      scheduleNext();
    });
  }, [autoplayDelay, products.length, next]);

  /* Restart schedule whenever current changes or spv changes */
  useEffect(() => {
    scheduleNext();
    return () => { autoplayRef.current?.kill(); };
  }, [current, scheduleNext]);

  /* ── Resize handler ─── */
  useEffect(() => {
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const newSpv = getSpv();
        spvRef.current = newSpv;
        setSpv(newSpv);
        // Re-snap to current without animation
        scrollTo(Math.min(currentIndexRef.current, Math.max(0, products.length - newSpv)), false);
      });
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(rafId); };
  }, [products.length, scrollTo]);

  /* ── GSAP Draggable (touch/mouse drag) ─── */
  useGSAP(() => {
    if (!trackRef.current || !containerRef.current) return;

    const draggable = Draggable.create(trackRef.current, {
      type: 'x',
      inertia: false,
      edgeResistance: 0.85,
      onDragStart() {
        isPausedRef.current = true;
        autoplayRef.current?.kill();
      },
      onDragEnd() {
        const velocity = this.getVelocity('x');
        const threshold = 50;
        if (velocity < -threshold) {
          next();
        } else if (velocity > threshold) {
          prev();
        } else {
          // Snap back to current if no significant drag
          scrollTo(currentIndexRef.current);
        }
        isPausedRef.current = false;
        scheduleNext();
      },
    });

    return () => draggable[0]?.kill();
  }, { scope: containerRef, dependencies: [next, prev, scrollTo, scheduleNext] });

  /* ── Initial entrance animation (GSAP) ─── */
  useGSAP(() => {
    if (!trackRef.current) return;
    const slides = trackRef.current.querySelectorAll<HTMLElement>('[data-slide]');
    gsap.fromTo(
      slides,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.1,
      },
    );
  }, { scope: trackRef, dependencies: [products.length] });

  if (products.length === 0) return null;

  const showNav = products.length > spv;

  return (
    <div className="relative select-none pb-10">
      {/* ── Track wrapper ─── */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => {
          isPausedRef.current = true;
          autoplayRef.current?.pause();
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
          autoplayRef.current?.resume();
          scheduleNext();
        }}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform cursor-grab active:cursor-grabbing"
          style={{ gap: `${GAP}px` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-slide
              className="shrink-0"
              style={{ width: `calc((100% - ${GAP * (spv - 1)}px) / ${spv})` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation buttons ─── */}
      {showNav && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-lg active:scale-95 md:-left-5"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-lg active:scale-95 md:-right-5"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Dot pagination ─── */}
      {showNav && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              ref={(el) => { dotsRef.current[i] = el; }}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-2 w-2 cursor-pointer rounded-full bg-primary opacity-40"
              style={{ transformOrigin: 'center center' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
