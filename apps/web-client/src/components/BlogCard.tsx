import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '@repo/types';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard = memo(function BlogCard({ blog }: BlogCardProps) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      <Link
        to={`/blog/${blog.slug}`}
        className="group block cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-elevated"
      >
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {blog.coverImage ? (
            <motion.img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary-light/15">
              <FileText size={40} className="text-primary/40" />
            </div>
          )}

          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/30 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-primary shadow-md">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary md:text-base">
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
              {blog.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {blog.author && (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white dark:text-background">
                    {blog.author.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {blog.author.name}
                  </span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default BlogCard;
