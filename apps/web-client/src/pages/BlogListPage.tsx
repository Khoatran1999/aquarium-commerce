import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Inbox } from 'lucide-react';
import { useBlogs } from '../hooks';
import { Skeleton } from '@repo/ui';
import BlogCard from '../components/BlogCard';

export default function BlogListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | undefined>();

  const { data: res, isLoading } = useBlogs({
    page,
    limit: 9,
    search: search || undefined,
    tag: activeTag,
  });

  const blogs = res?.data ?? [];
  const meta = res?.meta;

  // Collect unique tags from results
  const allTags = [...new Set(blogs.flatMap((b) => b.tags))];

  return (
    <>
      <Helmet>
        <title>Blog – AquaLuxe</title>
        <meta
          name="description"
          content="Fishkeeping tips, care guides, and aquarium stories from AquaLuxe."
        />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-foreground text-4xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-3">
            Tips, guides, and stories from our fishkeeping experts
          </p>
        </motion.div>

        {/* Search + Tag filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setActiveTag(undefined);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  !activeTag
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag === activeTag ? undefined : tag);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeTag === tag
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4">
                <Skeleton className="mb-4 aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
            <div className="mb-4">
              <Inbox size={48} className="text-muted-foreground/40" />
            </div>
            <h2 className="text-foreground text-xl font-semibold">No articles found</h2>
            <p className="text-muted-foreground mt-2">
              {search ? 'Try a different search term.' : 'Check back later for new articles!'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
