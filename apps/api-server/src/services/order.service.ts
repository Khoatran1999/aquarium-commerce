import { prisma, Prisma } from '../config/prisma.js';
import { parsePagination } from '../utils/pagination.js';
import { ApiError } from '../utils/api-error.js';

const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { take: 1, where: { isPrimary: true } },
          species: { select: { name: true } },
        },
      },
    },
  },
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

/**
 * Create order from cart — converts reserved → sold
 */
export async function createOrder(
  userId: string,
  data: {
    shippingAddress: string;
    shippingCity: string;
    shippingPhone: string;
    note?: string;
    paymentMethod?: string;
  },
) {
  return prisma.$transaction(async (tx: any) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Cart is empty');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: { productId: string; quantity: number; price: number; name: string }[] = [];

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw ApiError.badRequest(`Product "${item.product.name}" is no longer available`);
      }
      subtotal += item.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.product.name,
      });
    }

    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k

    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingPhone: data.shippingPhone,
        note: data.note,
        paymentMethod: data.paymentMethod || 'COD',
        items: { createMany: { data: orderItems } },
      },
      include: orderInclude,
    });

    // Convert reserved → sold for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          reserved: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'SELL',
          quantity: item.quantity,
          note: `Order ${order.id}`,
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
}

export async function getUserOrders(
  userId: string,
  query: { page?: string; limit?: string; status?: string },
) {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.OrderWhereInput = { userId };
  if (query.status) where.status = query.status as any;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function getOrderById(orderId: string, userId?: string) {
  const where: Prisma.OrderWhereUniqueInput = { id: orderId };
  const order = await prisma.order.findUnique({ where, include: orderInclude });

  if (!order) throw ApiError.notFound('Order not found');
  if (userId && order.userId !== userId)
    throw ApiError.forbidden('You are not authorized to view this order');

  return order;
}

/**
 * Cancel order — returns inventory to available
 */
export async function cancelOrder(orderId: string, userId: string) {
  return prisma.$transaction(async (tx: any) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw ApiError.notFound('Order not found');
    if (order.userId !== userId) throw ApiError.forbidden();
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw ApiError.badRequest('Cannot cancel order in this status');
    }

    // Return stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          available: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'RETURN',
          quantity: item.quantity,
          note: `Order ${orderId} cancelled`,
        },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: orderInclude,
    });
  });
}

/**
 * Admin: update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
    include: orderInclude,
  });
}

/**
 * Admin: list all orders
 */
export async function listAllOrders(query: {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}) {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.OrderWhereInput = {};
  if (query.status) where.status = query.status as any;
  if (query.search) {
    where.OR = [
      { id: { contains: query.search } },
      { user: { name: { contains: query.search, mode: 'insensitive' } } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}
