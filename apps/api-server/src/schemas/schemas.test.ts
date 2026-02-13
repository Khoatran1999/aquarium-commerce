import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  addToCartSchema,
  updateCartItemSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  createReviewSchema,
  createProductSchema,
} from './index';

describe('registerSchema', () => {
  it('passes with valid data', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('fails with short name', () => {
    const result = registerSchema.safeParse({
      name: 'J',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails with short password', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('allows optional phone', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      phone: '0901234567',
    });
    expect(result.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('passes with valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: 'pass',
    });
    expect(result.success).toBe(true);
  });

  it('fails with empty password', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('addToCartSchema', () => {
  it('passes with valid product ID and quantity', () => {
    const result = addToCartSchema.safeParse({
      productId: 'cmlgmqzvu003eul0kkubq5k3n',
      quantity: 2,
    });
    expect(result.success).toBe(true);
  });

  it('fails with empty productId', () => {
    const result = addToCartSchema.safeParse({
      productId: '',
      quantity: 1,
    });
    expect(result.success).toBe(false);
  });

  it('fails with quantity < 1', () => {
    const result = addToCartSchema.safeParse({
      productId: 'cmlgmqzvu003eul0kkubq5k3n',
      quantity: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('updateCartItemSchema', () => {
  it('passes with quantity 0 (for removal)', () => {
    const result = updateCartItemSchema.safeParse({ quantity: 0 });
    expect(result.success).toBe(true);
  });

  it('fails with negative quantity', () => {
    const result = updateCartItemSchema.safeParse({ quantity: -1 });
    expect(result.success).toBe(false);
  });
});

describe('createOrderSchema', () => {
  it('passes with valid order data', () => {
    const result = createOrderSchema.safeParse({
      shippingAddress: '123 Main Street, Apt 4',
      shippingCity: 'Ho Chi Minh City',
      shippingPhone: '0901234567',
      paymentMethod: 'COD',
    });
    expect(result.success).toBe(true);
  });

  it('fails with short address', () => {
    const result = createOrderSchema.safeParse({
      shippingAddress: 'Short',
      shippingCity: 'HCMC',
      shippingPhone: '0901234567',
    });
    expect(result.success).toBe(false);
  });

  it('defaults paymentMethod to COD', () => {
    const result = createOrderSchema.safeParse({
      shippingAddress: '123 Main Street, Apt 4',
      shippingCity: 'HCMC',
      shippingPhone: '0901234567',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paymentMethod).toBe('COD');
    }
  });

  it('rejects invalid payment method', () => {
    const result = createOrderSchema.safeParse({
      shippingAddress: '123 Main Street, Apt 4',
      shippingCity: 'HCMC',
      shippingPhone: '0901234567',
      paymentMethod: 'BITCOIN',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateOrderStatusSchema', () => {
  const validStatuses = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'SHIPPING',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ];

  it.each(validStatuses)('accepts %s', (status) => {
    const result = updateOrderStatusSchema.safeParse({ status });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = updateOrderStatusSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});

describe('createReviewSchema', () => {
  it('passes with valid review', () => {
    const result = createReviewSchema.safeParse({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 4,
      comment: 'Great fish, very healthy!',
    });
    expect(result.success).toBe(true);
  });

  it('fails with rating > 5', () => {
    const result = createReviewSchema.safeParse({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it('fails with rating < 1', () => {
    const result = createReviewSchema.safeParse({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 0,
    });
    expect(result.success).toBe(false);
  });

  it('allows missing comment', () => {
    const result = createReviewSchema.safeParse({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 5,
    });
    expect(result.success).toBe(true);
  });
});

describe('createProductSchema', () => {
  const validProduct = {
    name: 'Golden Betta',
    price: 15.99,
    speciesId: '550e8400-e29b-41d4-a716-446655440000',
  };

  it('passes with minimal required fields', () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('fails with negative price', () => {
    const result = createProductSchema.safeParse({ ...validProduct, price: -10 });
    expect(result.success).toBe(false);
  });

  it('accepts valid size enum', () => {
    const result = createProductSchema.safeParse({ ...validProduct, size: 'M' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid size', () => {
    const result = createProductSchema.safeParse({ ...validProduct, size: 'XXL' });
    expect(result.success).toBe(false);
  });

  it('accepts images array', () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      images: [{ url: 'https://example.com/fish.jpg', isPrimary: true }],
    });
    expect(result.success).toBe(true);
  });
});
