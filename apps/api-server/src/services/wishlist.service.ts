import { prisma } from '../config/prisma.js';
import type { Prisma } from '@prisma/client';
import { parsePagination } from '../utils/pagination.js';
import { ApiError } from '../utils/api-error.js';

// Product details to include when returning wishlist items
const wishlistInclude = {
  product: {
    include: {
      species: {
        select: {
          id: true,
          name: true,
          careLevel: true,
          waterType: true,
          temperament: true,
        },
      },
      images: {
        select: { id: true, url: true, isPrimary: true },
        orderBy: { isPrimary: 'desc' as const },
        take: 1,
      },
    },
  },
} satisfies Prisma.WishlistInclude;

/** Get user's complete wishlist */
export async function getUserWishlist(
  userId: string,
  filters?: { page?: string; limit?: string },
) {
  const { page, limit, skip } = parsePagination(filters ?? {});

  const where: Prisma.WishlistWhereInput = { userId };

  const [items, total] = await Promise.all([
    prisma.wishlist.findMany({
      where,
      include: wishlistInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.wishlist.count({ where }),
  ]);

  return { items, total, page, limit };
}

/** Add product to user's wishlist */
export async function addToWishlist(userId: string, productId: string) {
  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, isActive: true },
  });

  if (!product || !product.isActive) {
    throw ApiError.notFound('Product not found');
  }

  // Check if already wishlisted (upsert-style)
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    throw ApiError.conflict('Product already in wishlist');
  }

  return prisma.wishlist.create({
    data: { userId, productId },
    include: wishlistInclude,
  });
}

/** Remove product from user's wishlist */
export async function removeFromWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (!existing) {
    throw ApiError.notFound('Product not in wishlist');
  }

  return prisma.wishlist.delete({
    where: { userId_productId: { userId, productId } },
  });
}

/** Check if product is in user's wishlist */
export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });

  return { isWishlisted: !!item };
}

/** Get all wishlisted product IDs for a user (for batch checking) */
export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    select: { productId: true },
  });

  return items.map((item) => item.productId);
}
