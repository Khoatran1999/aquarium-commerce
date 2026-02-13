import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useBlog, useBlogs } from '../hooks';
import { Skeleton } from '@repo/ui';
import BlogCard from '../components/BlogCard';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: res, isLoading } = useBlog(slug ?? '');
  const blog = res?.data;

  // Related posts (latest 3, excluding current)
  const { data: relatedRes } = useBlogs({ limit: 4 });
  const related = (relatedRes?.data ?? []).filter((b) => b.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-3/4" />
        <Skeleton className="mb-4 h-5 w-1/3" />
        <Skeleton className="mb-8 aspect-[16/9] w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-foreground text-2xl font-bold">Article not found</h2>
        <Link to="/blog" className="text-primary mt-4 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const publishDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <>
      <Helmet>
        <title>{blog.title} – AquaLuxe Blog</title>
        <meta name="description" content={blog.excerpt ?? blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt ?? ''} />
        <meta property="og:type" content="article" />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
      </Helmet>

      <article className="mx-auto max-w-3xl px-4 py-8 md:px-10">
        {/* Breadcrumb */}
        <nav className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{blog.title}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-foreground text-3xl font-bold leading-tight md:text-4xl">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
            {blog.author && (
              <div className="flex items-center gap-2">
                <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
                  {blog.author.name?.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium">{blog.author.name}</span>
              </div>
            )}
            {publishDate && (
              <>
                <span>·</span>
                <time>{publishDate}</time>
              </>
            )}
            <span>·</span>
            <span>{blog.viewCount} views</span>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl">
              <img src={blog.coverImage} alt={blog.title} className="h-auto w-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert text-foreground mt-8 max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="border-border border-t">
          <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-10">
            <h2 className="text-foreground mb-8 text-2xl font-bold">More Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
