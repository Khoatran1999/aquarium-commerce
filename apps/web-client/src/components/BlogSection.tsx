import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogs } from '../hooks';
import { Skeleton } from '@repo/ui';
import BlogCard from './BlogCard';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function BlogSection() {
  const { data: res, isLoading } = useBlogs({ limit: 3 });
  const blogs = res?.data ?? [];

  if (!isLoading && blogs.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
      <motion.div
        className="mb-10 flex items-end justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-foreground text-3xl font-bold">From Our Blog</h2>
          <p className="text-muted-foreground mt-2">Tips, guides, and fishkeeping stories</p>
        </div>
        <Link
          to="/blog"
          className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors"
        >
          View All →
        </Link>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4">
                <Skeleton className="mb-4 aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))
          : blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
      </div>
    </section>
  );
}
