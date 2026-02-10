import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks';
import { Skeleton } from '@repo/ui';
import ProductCard from '../components/ProductCard';
import type { Product } from '@repo/types';

/* ── Constants ────────────────────────────── */
const CATEGORIES = [
  {
    name: 'Freshwater Fish',
    icon: '🐠',
    href: '/products?waterType=FRESHWATER',
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    name: 'Saltwater Fish',
    icon: '🐡',
    href: '/products?waterType=SALTWATER',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    name: 'Mini Aquarium',
    icon: '🐟',
    href: '/products?size=XS&size=S',
    color: 'from-teal-500/20 to-emerald-500/20',
  },
  {
    name: 'Koi Fish',
    icon: '🎏',
    href: '/products?search=koi',
    color: 'from-orange-500/20 to-red-500/20',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    text: 'Beautiful fish, arrived healthy and vibrant. The packaging was top-notch!',
    rating: 5,
  },
  {
    name: 'James L.',
    text: 'Excellent selection of rare species. My koi pond has never looked better.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    text: 'Fast shipping and the AI advisor helped me pick the perfect tank mates.',
    rating: 4,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function HomePage() {
  const { data: featuredResponse, isLoading } = useProducts({ sortBy: 'popular', limit: 8 });
  const products: Product[] = featuredResponse?.data ?? [];

  return (
    <>
      <Helmet>
        <title>AquaLuxe – Premium Ornamental Fish</title>
        <meta
          name="description"
          content="Shop the finest selection of premium ornamental fish. Freshwater, saltwater, koi and rare species delivered to your door."
        />
        <meta property="og:title" content="AquaLuxe – Premium Ornamental Fish" />
        <meta
          property="og:description"
          content="Shop the finest selection of premium ornamental fish."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── Hero Section ─── */}
      <section className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#004050] to-[#001820]">
        {/* Animated bubbles background */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: 8 + Math.random() * 40,
                height: 8 + Math.random() * 40,
                left: `${Math.random() * 100}%`,
                bottom: -50,
              }}
              animate={{ y: [0, -700], opacity: [0.6, 0] }}
              transition={{
                duration: 4 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 flex max-w-4xl flex-col items-center gap-6 px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="bg-accent inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-900"
          >
            Tropical Fish Collection
          </motion.span>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl font-black leading-tight tracking-tight text-white drop-shadow-2xl md:text-8xl"
          >
            Bring the Ocean Home
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="max-w-xl text-lg text-white/80">
            Discover our curated collection of premium ornamental fish, carefully selected with
            nationwide delivery.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <Link
              to="/products"
              className="bg-secondary hover:bg-secondary-dark inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Shop Now
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Featured Categories ─── */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
        <motion.h2
          className="text-foreground mb-10 text-center text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Shop by Category
        </motion.h2>
        <motion.div
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} variants={fadeUp} custom={i}>
              <Link
                to={cat.href}
                className="bg-card border-border shadow-card hover:shadow-elevated group flex flex-col items-center gap-4 rounded-2xl border p-8 transition-all hover:-translate-y-1"
              >
                <span
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl ${cat.color}`}
                >
                  {cat.icon}
                </span>
                <span className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Featured Products ─── */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.div
            className="mb-10 flex items-end justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-foreground text-3xl font-bold">Featured Fish</h2>
              <p className="text-muted-foreground mt-2">Our most popular ornamental fish</p>
            </div>
            <Link
              to="/products"
              className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors"
            >
              View All →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-4">
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
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── AI Advisor Banner ─── */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004050] to-[#006060] p-10 md:p-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90">
              ✨ AI-Powered
            </span>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Not sure what fish to get?
            </h2>
            <p className="mb-8 max-w-lg text-white/70">
              Our AI Advisor analyzes your tank setup, experience level, and preferences to
              recommend the perfect fish for your aquarium.
            </p>
            <Link
              to="/ai-chat"
              className="bg-accent hover:bg-accent-dark inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-slate-900 transition-all hover:scale-105"
            >
              Talk to AI Advisor
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
        </motion.div>
      </section>

      {/* ── Testimonials ─── */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <motion.h2
            className="text-foreground mb-10 text-center text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-card border-border shadow-card rounded-2xl border p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-accent mb-3 text-sm">
                  {'★'.repeat(t.rating)}
                  {'☆'.repeat(5 - t.rating)}
                </div>
                <p className="text-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
                <p className="text-muted-foreground text-xs font-semibold">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
