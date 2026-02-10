import { z } from 'zod';

// ── Auth ────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ── Product Filters ─────────────────────────────────
export const productQuerySchema = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    speciesId: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.union([z.string(), z.array(z.string())]).optional(),
    careLevel: z.union([z.string(), z.array(z.string())]).optional(),
    waterType: z.union([z.string(), z.array(z.string())]).optional(),
    temperament: z.union([z.string(), z.array(z.string())]).optional(),
    sort: z.string().optional(),
    sortBy: z.string().optional(),
    inStock: z.string().optional(),
  })
  .passthrough();

// ── Cart ────────────────────────────────────────────
export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Minimum quantity is 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Invalid quantity'),
});

// ── Order ───────────────────────────────────────────
export const createOrderSchema = z.object({
  shippingAddress: z.string().min(10, 'Shipping address must be at least 10 characters'),
  shippingCity: z.string().min(2, 'Invalid city'),
  shippingPhone: z.string().min(9, 'Invalid phone number'),
  note: z.string().optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'E_WALLET']).default('COD'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'SHIPPING',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
});

// ── Review ──────────────────────────────────────────
export const createReviewSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1-5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').optional(),
});

// ── Species (Admin) ─────────────────────────────────
export const createSpeciesSchema = z.object({
  name: z.string().min(2),
  scientificName: z.string().min(2),
  description: z.string().optional(),
  careLevel: z.enum(['EASY', 'MODERATE', 'HARD', 'EXPERT']),
  temperament: z.enum(['PEACEFUL', 'SEMI_AGGRESSIVE', 'AGGRESSIVE']),
  waterType: z.enum(['FRESHWATER', 'SALTWATER', 'BRACKISH']),
  minTankSize: z.number().int().min(1).optional(),
  minTemp: z.number().optional(),
  maxTemp: z.number().optional(),
  minPh: z.number().optional(),
  maxPh: z.number().optional(),
  maxSize: z.number().optional(),
  lifespan: z.string().optional(),
  diet: z.string().optional(),
  origin: z.string().optional(),
});

// ── Product (Admin) ─────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be >= 0'),
  compareAtPrice: z.number().min(0).optional(),
  speciesId: z.string().uuid(),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL']).optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  available: z.number().int().min(0).default(0),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();
