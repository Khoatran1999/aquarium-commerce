import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/api-error.js';

/**
 * Get or create cart for user
 */
async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { take: 1, where: { isPrimary: true } },
              species: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1, where: { isPrimary: true } },
                species: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  return cart;
}

export async function getCart(userId: string) {
  return getOrCreateCart(userId);
}

/**
 * Add item to cart — reserves inventory
 */
export async function addToCart(userId: string, productId: string, quantity: number) {
  return prisma.$transaction(async (tx: any) => {
    // Check product availability
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) throw ApiError.notFound('Product not found');
    if (product.available < quantity)
      throw ApiError.badRequest(`Only ${product.available} items available`);

    // Get or create cart
    let cart = await tx.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await tx.cart.create({ data: { userId } });
    }

    // Check if item already in cart
    const existingItem = await tx.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    let newQty = quantity;
    if (existingItem) {
      newQty = existingItem.quantity + quantity;
      if (product.available < quantity) {
        throw ApiError.badRequest(`Only ${product.available} items available`);
      }
    }

    // Reserve inventory
    await tx.product.update({
      where: { id: productId },
      data: { available: { decrement: quantity }, reserved: { increment: quantity } },
    });

    // Log inventory
    await tx.inventoryLog.create({
      data: { productId, action: 'RESERVE', quantity, note: `Cart add by user ${userId}` },
    });

    // Upsert cart item
    if (existingItem) {
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty, price: product.price },
      });
    } else {
      await tx.cartItem.create({
        data: { cartId: cart.id, productId, quantity, price: product.price },
      });
    }

    return getOrCreateCart(userId);
  });
}

/**
 * Update cart item quantity — adjusts reservations
 */
export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  return prisma.$transaction(async (tx: any) => {
    const cart = await tx.cart.findUnique({ where: { userId } });
    if (!cart) throw ApiError.notFound('Cart not found');

    const item = await tx.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw ApiError.notFound('Item not found in cart');

    const diff = quantity - item.quantity;

    if (quantity === 0) {
      // Remove item — release all reserved
      await tx.product.update({
        where: { id: item.productId },
        data: { available: { increment: item.quantity }, reserved: { decrement: item.quantity } },
      });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'RELEASE',
          quantity: item.quantity,
          note: `Cart remove by user ${userId}`,
        },
      });
      await tx.cartItem.delete({ where: { id: itemId } });
    } else if (diff > 0) {
      // Increasing — reserve more
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || product.available < diff) throw ApiError.badRequest('Insufficient stock');

      await tx.product.update({
        where: { id: item.productId },
        data: { available: { decrement: diff }, reserved: { increment: diff } },
      });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'RESERVE',
          quantity: diff,
          note: `Cart update by user ${userId}`,
        },
      });
      await tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
    } else if (diff < 0) {
      // Decreasing — release some
      const release = Math.abs(diff);
      await tx.product.update({
        where: { id: item.productId },
        data: { available: { increment: release }, reserved: { decrement: release } },
      });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'RELEASE',
          quantity: release,
          note: `Cart update by user ${userId}`,
        },
      });
      await tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }

    return getOrCreateCart(userId);
  });
}

/**
 * Remove item from cart — releases reservation
 */
export async function removeCartItem(userId: string, itemId: string) {
  return updateCartItem(userId, itemId, 0);
}

/**
 * Clear entire cart — releases all reservations
 */
export async function clearCart(userId: string) {
  return prisma.$transaction(async (tx: any) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart || cart.items.length === 0) return;

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { available: { increment: item.quantity }, reserved: { decrement: item.quantity } },
      });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'RELEASE',
          quantity: item.quantity,
          note: `Cart clear by user ${userId}`,
        },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return getOrCreateCart(userId);
  });
}
