import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Fish, Shell, Waves, Palmtree, ArrowRight, MessageCircle, Sparkles, ShieldCheck, Truck, Star } from 'lucide-react';
import { useProducts } from '../hooks';
import { Skeleton } from '@repo/ui';
import ProductCard from '../components/ProductCard';
import NewArrivalsSection from '../components/NewArrivalsSection';
import BestSellersSection from '../components/BestSellersSection';
import BlogSection from '../components/BlogSection';
import type { Product } from '@repo/types';

/* ── Constants ─── */
const CATEGORIES = [
  {
    name: 'Freshwater Fish',
    icon: Fish,
    href: '/products?waterType=FRESHWATER',
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40',
    border: 'border-cyan-200/60 dark:border-cyan-800/40',
  },
  {
    name: 'Saltwater Fish',
    icon: Shell,
    href: '/products?waterType=SALTWATER',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40',
    border: 'border-blue-200/60 dark:border-blue-800/40',
  },
  {
    name: 'Mini Aquarium',
    icon: Waves,
    href: '/products?size=XS&size=S',
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40',
    border: 'border-teal-200/60 dark:border-teal-800/40',
  },
  {
    name: 'Koi Fish',
    icon: Palmtree,
    href: '/products?search=koi',
    gradient: 'from-orange-500 to-red-500',
    bg: 'from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40',
    border: 'border-orange-200/60 dark:border-orange-800/40',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Aquarium Enthusiast',
    text: 'Beautiful fish, arrived healthy and vibrant. The packaging was absolutely top-notch!',
    rating: 5,
    initials: 'SM',
  },
  {
    name: 'James L.',
    role: 'Koi Pond Owner',
    text: 'Excellent selection of rare species. My koi pond has never looked better. Will definitely order again.',
    rating: 5,
    initials: 'JL',
  },
  {
    name: 'Emily R.',
    role: 'Hobbyist',
    text: 'Fast shipping and the AI advisor helped me pick the perfect tank mates for my setup.',
    rating: 4,
    initials: 'ER',
  },
];

const STATS = [
  { value: '10K+', label: 'Fish Delivered' },
  { value: '500+', label: 'Species Available' },
  { value: '98%', label: 'Live Arrival Rate' },
  { value: '4.9★', label: 'Customer Rating' },
];

const TRUST_BADGES = [
  { icon: Truck, label: 'Nationwide Delivery' },
  { icon: ShieldCheck, label: 'Live Arrival Guaranteed' },
  { icon: Star, label: '4.9★ Rated Service' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' } }),
};
const fadeUpInstant = { hidden: {}, visible: () => ({}) };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const staggerInstant = { visible: {} };

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const animFadeUp = shouldReduceMotion ? fadeUpInstant : fadeUp;
  const animStagger = shouldReduceMotion ? staggerInstant : stagger;

  const { data: featuredResponse, isLoading } = useProducts({ sortBy: 'popular', limit: 8 });
  const products: Product[] = featuredResponse?.data ?? [];

  const bubbleStyles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        width: 6 + Math.random() * 36,
        height: 6 + Math.random() * 36,
        left: `${Math.random() * 100}%`,
        delay: i * 0.35,
        duration: 5 + Math.random() * 4,
      })),
    [],
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#0A1825] focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Helmet>
        <title>AquaLuxe – Premium Ornamental Fish</title>
        <meta
          name="description"
          content="Shop the finest selection of premium ornamental fish. Freshwater, saltwater, koi and rare species delivered to your door."
        />
        <meta property="og:title" content="AquaLuxe – Premium Ornamental Fish" />
        <meta property="og:description" content="Shop the finest selection of premium ornamental fish." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── Hero Section ─── */}
      <section
        id="main-content"
        className="relative flex min-h-[680px] w-full items-center justify-center overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,148,196,0.35) 0%, transparent 60%), linear-gradient(180deg, #00263A 0%, #001428 55%, #000A16 100%)',
        }}
      >
        {/* Animated mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 80%, rgba(0,204,238,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(0,148,196,0.12) 0%, transparent 40%)',
          }}
        />

        {/* Animated bubbles */}
        {!shouldReduceMotion && (
          <div className="pointer-events-none absolute inset-0">
            {bubbleStyles.map((style, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/10 bg-white/5"
                style={{ width: style.width, height: style.height, left: style.left, bottom: -60 }}
                animate={{ y: [0, -720], opacity: [0, 0.7, 0] }}
                transition={{
                  duration: style.duration,
                  repeat: Infinity,
                  delay: style.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Decorative glow orbs */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0094C4, transparent)' }}
        />
        <div
          className="pointer-events-none absolute right-1/4 bottom-1/3 h-48 w-48 translate-x-1/2 translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00CCEE, transparent)' }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 flex max-w-4xl flex-col items-center gap-6 px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={animStagger}
        >
          <motion.span
            variants={animFadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/85 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00CCEE]" />
            Tropical Fish Collection
          </motion.span>

          <motion.h1
            variants={animFadeUp}
            custom={1}
            className="text-pretty text-5xl font-black leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Bring the{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #33B6D8 0%, #00CCEE 50%, #55DDFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ocean
            </span>{' '}
            Home
          </motion.h1>

          <motion.p
            variants={animFadeUp}
            custom={2}
            className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
          >
            Discover our curated collection of premium ornamental fish, carefully selected with
            nationwide delivery and live arrival guarantee.
          </motion.p>

          <motion.div variants={animFadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0094C4] to-[#0077A3] px-8 py-3.5 text-base font-bold text-white shadow-[0_4px_24px_rgba(0,148,196,0.5)] transition-all duration-200 hover:shadow-[0_6px_32px_rgba(0,148,196,0.65)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Shop Now
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/ai-chat"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3.5 text-base font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/35"
            >
              <Sparkles size={16} />
              AI Advisor
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={animFadeUp}
            custom={4}
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-white/50">
                <badge.icon size={13} className="text-[#00CCEE]/70" />
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats bar ─── */}
      <section className="border-b border-[#CCE0ED] bg-white dark:border-[#0D2C45] dark:bg-[#041628]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <div className="grid grid-cols-2 divide-x divide-[#CCE0ED] md:grid-cols-4 dark:divide-[#0D2C45]">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-0.5 py-5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <span className="text-2xl font-black text-[#0094C4] dark:text-[#00CCEE]">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-[#547698] dark:text-[#6496B8]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Categories ─── */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0094C4] dark:text-[#00CCEE]">
            Explore
          </p>
          <h2 className="text-3xl font-bold text-[#0A1825] dark:text-[#D6EAFF] md:text-4xl">
            Shop by Category
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={animStagger}
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} variants={animFadeUp} custom={i}>
              <Link
                to={cat.href}
                className={`group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094C4] ${cat.bg} ${cat.border}`}
              >
                {/* Icon with gradient bg */}
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${cat.gradient}`}
                >
                  <cat.icon size={30} className="text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <span className="text-center text-sm font-semibold text-[#0A1825] transition-colors duration-200 group-hover:text-[#0094C4] dark:text-[#D6EAFF] dark:group-hover:text-[#00CCEE]">
                  {cat.name}
                </span>

                {/* Arrow on hover */}
                <ArrowRight
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-2 text-[#0094C4] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:text-[#00CCEE]"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── New Arrivals ─── */}
      <NewArrivalsSection />

      {/* ── Best Sellers ─── */}
      <BestSellersSection />

      {/* ── Featured Products ─── */}
      <section className="bg-[#E4EFF8]/50 py-20 dark:bg-[#071F36]/40">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mb-10 flex items-end justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#0094C4] dark:text-[#00CCEE]">
                Top Picks
              </p>
              <h2 className="text-3xl font-bold text-[#0A1825] dark:text-[#D6EAFF]">
                Featured Fish
              </h2>
              <p className="mt-1.5 text-sm text-[#547698] dark:text-[#6496B8]">
                Our most popular ornamental fish
              </p>
            </div>
            <Link
              to="/products"
              className="group hidden items-center gap-1.5 text-sm font-semibold text-[#0094C4] transition-colors hover:text-[#0077A3] dark:text-[#00CCEE] dark:hover:text-[#55DDFF] sm:flex"
            >
              View All
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white p-4 dark:bg-[#041628]">
                    <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-full border border-[#CCE0ED] bg-white px-6 py-2.5 text-sm font-semibold text-[#0094C4] shadow-sm hover:border-[#0094C4] dark:border-[#0D2C45] dark:bg-[#041628] dark:text-[#00CCEE] dark:hover:border-[#00CCEE]"
            >
              View All Fish <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog Section ─── */}
      <BlogSection />

      {/* ── AI Advisor Banner ─── */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
        <motion.div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background:
              'linear-gradient(135deg, #002D45 0%, #004060 40%, #003355 70%, #001E33 100%)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative mesh */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(0,204,238,0.12) 0%, transparent 60%), radial-gradient(circle at 10% 20%, rgba(0,148,196,0.15) 0%, transparent 40%)',
            }}
          />

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/5 bg-white/[0.03]" />
          <div className="pointer-events-none absolute -bottom-8 right-16 h-40 w-40 rounded-full border border-white/5 bg-white/[0.03]" />
          <div className="pointer-events-none absolute right-40 top-8 h-20 w-20 rounded-full border border-[#00CCEE]/10 bg-[#00CCEE]/[0.04]" />

          <div className="relative z-10 flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-lg">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00CCEE]/25 bg-[#00CCEE]/10 px-4 py-1.5 text-xs font-semibold text-[#00CCEE]">
                <Sparkles size={13} /> AI-Powered Recommendations
              </span>
              <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-4xl">
                Not sure what fish to get?
              </h2>
              <p className="text-base leading-relaxed text-white/60">
                Our AI Advisor analyzes your tank setup, experience level, and preferences to
                recommend the perfect fish for your aquarium.
              </p>
            </div>
            <Link
              to="/ai-chat"
              className="group shrink-0 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FFB300] to-[#FF8C00] px-8 py-4 text-base font-bold text-[#0A1825] shadow-[0_4px_20px_rgba(255,179,0,0.4)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(255,179,0,0.55)] hover:scale-[1.03]"
            >
              Talk to AI Advisor
              <MessageCircle size={18} className="transition-transform duration-200 group-hover:scale-110" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Testimonials ─── */}
      <section className="bg-[#E4EFF8]/50 py-20 dark:bg-[#071F36]/40">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0094C4] dark:text-[#00CCEE]">
              Reviews
            </p>
            <h2 className="text-3xl font-bold text-[#0A1825] dark:text-[#D6EAFF] md:text-4xl">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="relative overflow-hidden rounded-2xl border border-[#CCE0ED] bg-white p-7 shadow-sm transition-shadow hover:shadow-md dark:border-[#0D2C45] dark:bg-[#041628]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Quote mark */}
                <div
                  className="pointer-events-none absolute right-5 top-4 text-6xl font-black leading-none text-[#0094C4]/8 dark:text-[#00CCEE]/8"
                  aria-hidden="true"
                >
                  "
                </div>

                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      className={si < t.rating ? 'fill-[#FFB300] text-[#FFB300]' : 'text-[#CCE0ED] dark:text-[#0D2C45]'}
                    />
                  ))}
                </div>

                <p className="mb-5 text-sm leading-relaxed text-[#0A1825]/80 dark:text-[#D6EAFF]/75">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0094C4] to-[#0077A3] text-xs font-bold text-white dark:from-[#00CCEE] dark:to-[#0094C4] dark:text-[#000F1E]">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1825] dark:text-[#D6EAFF]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#547698] dark:text-[#6496B8]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
