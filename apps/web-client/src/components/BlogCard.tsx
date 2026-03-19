/**
 * BlogCard
 * - framer-motion for subtle hover lift + image scale micro-interaction
 * - Updated to new AquaLuxe v2 design tokens
 */
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
        className="group block overflow-hidden rounded-2xl border border-[#CCE0ED] bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,148,196,0.16)] dark:border-[#0D2C45] dark:bg-[#041628] dark:hover:shadow-[0_8px_32px_rgba(0,204,238,0.16)]"
      >
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#E4EFF8] dark:bg-[#071F36]">
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
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0094C4]/15 to-[#33B6D8]/15 dark:from-[#00CCEE]/10 dark:to-[#55DDFF]/10">
              <FileText size={40} className="text-[#0094C4]/40 dark:text-[#00CCEE]/40" />
            </div>
          )}

          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/30 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0094C4] shadow-md dark:bg-[#041628]/90 dark:text-[#00CCEE]">
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
                  className="rounded-full bg-[#E4EFF8] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0094C4] dark:bg-[#071F36] dark:text-[#55DDFF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0A1825] transition-colors duration-200 group-hover:text-[#0094C4] dark:text-[#D6EAFF] dark:group-hover:text-[#00CCEE] md:text-base">
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#547698] dark:text-[#6496B8] md:text-sm">
              {blog.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {blog.author && (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#0094C4] to-[#0077A3] text-[10px] font-bold text-white dark:from-[#00CCEE] dark:to-[#0094C4] dark:text-[#000F1E]">
                    {blog.author.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-[#547698] dark:text-[#6496B8]">
                    {blog.author.name}
                  </span>
                </>
              )}
            </div>
            <span className="text-xs text-[#547698] dark:text-[#6496B8]">{date}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default BlogCard;
