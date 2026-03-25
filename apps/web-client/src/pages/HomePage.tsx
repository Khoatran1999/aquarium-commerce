import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Fish, Shell, Waves, ArrowRight, ShieldCheck, Truck, Star, Package } from 'lucide-react';
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
    icon: Fish,
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
    text: 'Fast shipping and great customer support helped me pick the perfect tank mates for my setup.',
    rating: 4,
    initials: 'ER',
  },
];

const STATS = [
  { value: '10K+', label: 'Fish Delivered', icon: Package },
  { value: '500+', label: 'Species Available', icon: Fish },
  { value: '98%', label: 'Live Arrival Rate', icon: ShieldCheck },
  { value: '4.9★', label: 'Customer Rating', icon: Star },
];

const TRUST_BADGES = [
  { icon: Truck, label: 'Nationwide Delivery' },
  { icon: ShieldCheck, label: 'Live Arrival Guaranteed' },
  { icon: Star, label: '4.9-star Rated Service' },
];

const WHY_US = [
  {
    icon: ShieldCheck,
    title: 'Live Arrival Guarantee',
    desc: 'Every fish is guaranteed to arrive alive. If not, we replace or refund — no questions asked.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Temperature-controlled express shipping to all provinces. Fish arrive healthy and stress-free.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Fish,
    title: '500+ Premium Species',
    desc: 'Freshwater, saltwater, koi and rare species curated from trusted breeders across the country.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Star,
    title: 'Expert Care Support',
    desc: 'Our aquarium specialists are available to help you choose the right fish and set up your tank.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
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
      Array.from({ length: 8 }, (_, i) => ({
        width: 6 + Math.random() * 36,
        height: 6 + Math.random() * 36,
        left: `${Math.random() * 100}%`,
        delay: i * 0.45,
        duration: 5 + Math.random() * 4,
      })),
    [],
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
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
        <meta name="theme-color" content="#000A16" />
      </Helmet>

      <main id="main-content">
      {/* ── Hero Section ─── */}
      <section
        aria-label="Hero"
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
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

        {/* Animated bubbles (reduced to 8 for performance) */}
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
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
            Tropical Fish Collection
          </motion.span>

          <motion.h1
            variants={animFadeUp}
            custom={1}
            className="text-pretty text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-7xl lg:text-8xl"
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
            className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
          >
            Discover our curated collection of premium ornamental fish, carefully selected with
            nationwide delivery and live arrival guarantee.
          </motion.p>

          <motion.div variants={animFadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-base font-bold text-white shadow-[0_4px_24px_rgba(0,148,196,0.5)] transition-all duration-200 hover:shadow-[0_6px_32px_rgba(0,148,196,0.65)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Shop Now
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/products?category=species"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Browse Species
              <Fish size={18} className="transition-transform duration-200 group-hover:scale-110" />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={animFadeUp}
            custom={4}
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-white/80">
                <badge.icon size={13} className="text-primary-light" aria-hidden="true" />
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats bar ─── */}
      <section aria-label="Statistics" className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-6"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <stat.icon size={18} className="mb-0.5 text-primary" aria-hidden="true" />
                <span
                  className="tabular-nums text-2xl font-black text-primary"
                  aria-label={stat.value.replace('★', ' star')}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Categories ─── */}
      <section aria-label="Shop by Category" className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            Explore
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
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
                className={`group relative flex cursor-pointer flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cat.bg} ${cat.border}`}
              >
                {/* Icon with gradient bg */}
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${cat.gradient}`}
                >
                  <cat.icon size={30} className="text-white" aria-hidden="true" />
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <span className="text-center text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                  {cat.name}
                </span>

                {/* Arrow on hover */}
                <ArrowRight
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-2 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
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
      <section aria-label="Featured Fish" className="bg-muted/50 py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mb-10 flex items-end justify-between"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Top Picks
              </p>
              <h2 className="text-balance text-3xl font-bold text-foreground">Featured Fish</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Our most popular ornamental fish
              </p>
            </div>
            <Link
              to="/products"
              className="group hidden cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:flex"
            >
              View All
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5"
            initial={shouldReduceMotion ? {} : 'hidden'}
            whileInView={shouldReduceMotion ? {} : 'visible'}
            viewport={{ once: true }}
            variants={animStagger}
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-card p-4">
                    <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : products.map((p, i) => (
                  <motion.div key={p.id} variants={animFadeUp} custom={i}>
                    <ProductCard product={p} showAddToCart />
                  </motion.div>
                ))}
          </motion.div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              to="/products"
              className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-primary shadow-sm hover:border-primary"
            >
              View All Fish <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog Section ─── */}
      <BlogSection />

      {/* ── Why AquaLuxe ─── */}
      <section aria-label="Why AquaLuxe" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mb-12 text-center"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Our Promise
            </p>
            <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
              Why Choose AquaLuxe?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              We're passionate about connecting fish lovers with the finest specimens, backed by
              expert knowledge and exceptional service.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial={shouldReduceMotion ? {} : 'hidden'}
            whileInView={shouldReduceMotion ? {} : 'visible'}
            viewport={{ once: true }}
            variants={animStagger}
          >
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                variants={animFadeUp}
                custom={i}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon size={22} className={item.color} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─── */}
      <section aria-label="Customer Reviews" className="bg-card py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mb-12 text-center"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Reviews
            </p>
            <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="relative overflow-hidden rounded-2xl border border-border bg-background p-7 shadow-card transition-shadow hover:shadow-elevated"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Quote mark */}
                <div
                  className="pointer-events-none absolute right-5 top-4 text-6xl font-black leading-none text-primary/8"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <div
                  className="mb-4 flex gap-0.5"
                  aria-label={`${t.rating} out of 5 stars`}
                  role="img"
                >
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      aria-hidden="true"
                      className={si < t.rating ? 'fill-accent text-accent' : 'text-border'}
                    />
                  ))}
                </div>

                <p className="mb-5 text-sm leading-relaxed text-foreground/80">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white dark:text-background">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ─── */}
      <section aria-label="Newsletter" className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
              <Fish size={26} className="text-primary" aria-hidden="true" />
            </div>
            <h2 className="mb-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Stay in the Loop
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Get notified about new arrivals, rare species, care guides and exclusive offers.
              Join 5,000+ aquarium enthusiasts.
            </p>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
      </main>
    </>
  );
}
