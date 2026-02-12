import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Observes when an element enters/leaves the viewport using IntersectionObserver.
 * Useful for lazy loading images, infinite scroll triggers, and reveal animations.
 */
export function useIntersection<T extends HTMLElement = HTMLDivElement>(
  // eslint-disable-next-line no-undef
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.root, options?.rootMargin]);

  return [ref, isIntersecting];
}
