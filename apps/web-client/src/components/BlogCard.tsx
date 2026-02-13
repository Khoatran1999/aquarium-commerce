import { memo } from 'react';
import { Link } from 'react-router-dom';
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
    <Link
      to={`/blog/${blog.slug}`}
      className="bg-card border-border shadow-card hover:shadow-elevated group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <span className="text-4xl">📝</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-base font-bold transition-colors">
          {blog.title}
        </h3>

        {blog.excerpt && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {blog.author && (
              <>
                <span className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                  {blog.author.name?.charAt(0).toUpperCase()}
                </span>
                <span>{blog.author.name}</span>
              </>
            )}
          </div>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
});

export default BlogCard;
