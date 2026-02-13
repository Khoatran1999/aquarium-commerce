import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';
import { parsePagination, slugify } from '../utils/pagination.js';
import { ApiError } from '../utils/api-error.js';

// ── Select for list view (exclude heavy content) ──
const blogListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  status: true,
  authorId: true,
  tags: true,
  viewCount: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, name: true, avatar: true },
  },
} satisfies Prisma.BlogPostSelect;

// ── Full include for detail view ──
const blogDetailInclude = {
  author: {
    select: { id: true, name: true, avatar: true },
  },
} satisfies Prisma.BlogPostInclude;

// ────────────────────────────────────────────────────
// Public APIs
// ────────────────────────────────────────────────────

interface BlogFilters {
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
}

/** List published blogs (public) */
export async function listPublishedBlogs(filters: BlogFilters) {
  const { page, limit, skip } = parsePagination(filters);

  const where: Prisma.BlogPostWhereInput = {
    status: 'PUBLISHED',
    publishedAt: { not: null },
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { excerpt: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.tag) {
    where.tags = { has: filters.tag };
  }

  const [blogs, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      select: blogListSelect,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { blogs, total, page, limit };
}

/** Get single blog by slug (public) + increment view count */
export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blogPost.findUnique({
    where: { slug },
    include: blogDetailInclude,
  });

  if (!blog || blog.status !== 'PUBLISHED') {
    throw ApiError.notFound('Blog post not found');
  }

  // Increment view count (fire-and-forget)
  prisma.blogPost
    .update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return blog;
}

// ────────────────────────────────────────────────────
// Admin APIs
// ────────────────────────────────────────────────────

interface AdminBlogFilters extends BlogFilters {
  status?: string;
}

/** List all blogs (admin — includes drafts) */
export async function listAllBlogs(filters: AdminBlogFilters) {
  const { page, limit, skip } = parsePagination(filters);

  const where: Prisma.BlogPostWhereInput = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { excerpt: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status as any;
  }

  if (filters.tag) {
    where.tags = { has: filters.tag };
  }

  const [blogs, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      select: blogListSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { blogs, total, page, limit };
}

/** Create a new blog post */
export async function createBlog(
  data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    tags?: string[];
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  },
  authorId: string,
) {
  const slug = data.slug || slugify(data.title);

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    throw ApiError.conflict('A blog post with this slug already exists');
  }

  const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      tags: data.tags ?? [],
      status: data.status ?? 'DRAFT',
      authorId,
      publishedAt,
    },
    include: blogDetailInclude,
  });
}

/** Update an existing blog post */
export async function updateBlog(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    tags?: string[];
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  },
) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Blog post not found');

  // Auto-generate slug from title if title changed and no explicit slug
  const updateData: any = { ...data };
  if (data.title && !data.slug) {
    updateData.slug = slugify(data.title);
  }

  // Set publishedAt when publishing for the first time
  if (data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
    updateData.publishedAt = new Date();
  }

  // Check slug uniqueness if slug is changing
  if (updateData.slug && updateData.slug !== existing.slug) {
    const slugTaken = await prisma.blogPost.findUnique({ where: { slug: updateData.slug } });
    if (slugTaken) throw ApiError.conflict('A blog post with this slug already exists');
  }

  return prisma.blogPost.update({
    where: { id },
    data: updateData,
    include: blogDetailInclude,
  });
}

/** Delete a blog post */
export async function deleteBlog(id: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Blog post not found');

  return prisma.blogPost.delete({ where: { id } });
}

/** Toggle blog status */
export async function updateBlogStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Blog post not found');

  const updateData: any = { status };

  // Set publishedAt when first published
  if (status === 'PUBLISHED' && !existing.publishedAt) {
    updateData.publishedAt = new Date();
  }

  return prisma.blogPost.update({
    where: { id },
    data: updateData,
    include: blogDetailInclude,
  });
}
