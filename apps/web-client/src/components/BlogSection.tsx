/**
 * BlogSection
 * - Header animated with GSAP ScrollTrigger
 * - Blog cards stagger-animated with GSAP ScrollTrigger
 * - framer-motion used for micro hover interactions on cards (via BlogCard)
 */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useBlogs } from '../hooks';
import { Skeleton } from '@repo/ui';
import BlogCard from './BlogCard';

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection() {
  const { data: res, isLoading } = useBlogs({ limit: 3 });
  const blogs = res?.data ?? [];

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Header entrance ─── */
  useGSAP(
    () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
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

  /* ── Cards stagger entrance ─── */
  useGSAP(
    () => {
      if (!gridRef.current || isLoading || blogs.length === 0) return;
      const cards = gridRef.current.querySelectorAll<HTMLElement>('[data-blog-card]');
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        },
      );
    },
    { scope: gridRef, dependencies: [isLoading, blogs.length] },
  );

  if (!isLoading && blogs.length === 0) return null;

  return (
    <section ref={sectionRef} className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p ref={labelRef} className="mb-1 text-xs font-bold uppercase tracking-widest text-[#0094C4] opacity-0 dark:text-[#00CCEE]">
            Insights
          </p>
          <h2 ref={titleRef} className="text-3xl font-bold text-[#0A1825] opacity-0 dark:text-[#D6EAFF] md:text-4xl">
            From Our Blog
          </h2>
          <p ref={subtitleRef} className="mt-1.5 text-sm text-[#547698] opacity-0 dark:text-[#6496B8]">
            Tips, guides, and fishkeeping stories
          </p>
        </div>
        <Link
          ref={linkRef}
          to="/blog"
          className="group hidden items-center gap-1.5 text-sm font-semibold text-[#0094C4] opacity-0 transition-colors hover:text-[#0077A3] dark:text-[#00CCEE] dark:hover:text-[#55DDFF] sm:flex"
        >
          View All
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 dark:bg-[#041628]">
                <Skeleton className="mb-4 aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))
          : blogs.map((blog) => (
              <div key={blog.id} data-blog-card className="opacity-0">
                <BlogCard blog={blog} />
              </div>
            ))}
      </div>
    </section>
  );
}
