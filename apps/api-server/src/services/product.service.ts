import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { parsePagination, slugify } from '../utils/pagination.js';
import { ApiError } from '../utils/api-error.js';

// Optimized: Select only necessary fields for list view
const productListSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  size: true,
  available: true,
  sold: true,
  avgRating: true,
  reviewCount: true,
  isActive: true,
  speciesId: true,
  createdAt: true,
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
    select: {
      id: true,
      url: true,
      isPrimary: true,
    },
    orderBy: { isPrimary: Prisma.SortOrder.desc },
    take: 1, // Only get primary image for list
  },
} satisfies Prisma.ProductSelect;

const productInclude = {
  species: {
    select: {
      id: true,
      name: true,
      scientificName: true,
      careLevel: true,
      waterType: true,
      temperament: true,
    },
  },
  images: { orderBy: { isPrimary: Prisma.SortOrder.desc } },
} satisfies Prisma.ProductInclude;

interface ProductFilters {
  page?: string;
  limit?: string;
  search?: string;
  speciesId?: string;
  minPrice?: string;
  maxPrice?: string;
  size?: string | string[];
  careLevel?: string | string[];
  waterType?: string | string[];
  temperament?: string | string[];
  sort?: string;
  sortBy?: string;
  inStock?: string;
}

export async function listProducts(filters: ProductFilters) {
  const { page, limit, skip } = parsePagination(filters);

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { species: { name: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }
  if (filters.speciesId) where.speciesId = filters.speciesId;
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
  }
  if (filters.size) {
    const sizes = Array.isArray(filters.size) ? filters.size : filters.size.split(',');
    where.size = { in: sizes as any };
  }
  if (filters.careLevel) {
    const levels = Array.isArray(filters.careLevel)
      ? filters.careLevel
      : filters.careLevel.split(',');
    where.species = {
      ...(where.species as any),
      careLevel: levels.length === 1 ? (levels[0] as any) : { in: levels as any },
    };
  }
  if (filters.waterType) {
    const types = Array.isArray(filters.waterType)
      ? filters.waterType
      : filters.waterType.split(',');
    where.species = {
      ...(where.species as any),
      waterType: types.length === 1 ? (types[0] as any) : { in: types as any },
    };
  }
  if (filters.temperament) {
    const temps = Array.isArray(filters.temperament)
      ? filters.temperament
      : filters.temperament.split(',');
    where.species = {
      ...(where.species as any),
      temperament: temps.length === 1 ? (temps[0] as any) : { in: temps as any },
    };
  }
  if (filters.inStock === 'true') where.available = { gt: 0 };

  const sortValue = filters.sortBy ?? filters.sort;
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  switch (sortValue) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'popular':
      orderBy = { sold: 'desc' };
      break;
    case 'rating':
      orderBy = { avgRating: 'desc' };
      break;
    case 'name_asc':
      orderBy = { name: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, select: productListSelect, skip, take: limit, orderBy }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productInclude,
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function createProduct(data: any) {
  const slug = data.slug || slugify(data.name);
  const { images, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      slug,
      images: images ? { createMany: { data: images } } : undefined,
    },
    include: productInclude,
  });
  return product;
}

export async function updateProduct(id: string, data: any) {
  const { images, ...productData } = data;
  if (productData.name && !data.slug) {
    productData.slug = slugify(productData.name);
  }

  const product = await prisma.product.update({
    where: { id },
    data: productData,
    include: productInclude,
  });
  return product;
}

export async function deleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getRelatedProducts(productId: string, speciesId: string) {
  return prisma.product.findMany({
    where: { speciesId, id: { not: productId }, isActive: true, available: { gt: 0 } },
    include: productInclude,
    take: 4,
  });
}
