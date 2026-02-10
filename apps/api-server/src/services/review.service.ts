import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/api-error.js';

export async function createReview(
  userId: string,
  data: { productId: string; rating: number; comment?: string },
) {
  // Check if user already reviewed this product
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId: data.productId } },
  });
  if (existing) throw ApiError.conflict('You have already reviewed this product');

  // Check if user has purchased this product
  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId: data.productId,
      order: { userId, status: { in: ['DELIVERED'] } },
    },
  });
  if (!purchased) throw ApiError.forbidden('You must purchase this product before reviewing');

  const review = await prisma.review.create({
    data: { userId, ...data },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  // Update product average rating
  const agg = await prisma.review.aggregate({
    where: { productId: data.productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: data.productId },
    data: {
      avgRating: agg._avg.rating || 0,
      reviewCount: agg._count,
    },
  });

  return review;
}

export async function getProductReviews(
  productId: string,
  query: { page?: string; limit?: string },
) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { reviews, total, page, limit };
}
