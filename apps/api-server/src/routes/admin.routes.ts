import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  createProductSchema,
  updateProductSchema,
  createSpeciesSchema,
  updateOrderStatusSchema,
} from '../schemas/index.js';
import * as productService from '../services/product.service.js';
import * as speciesService from '../services/species.service.js';
import * as orderService from '../services/order.service.js';
import { prisma } from '../config/prisma.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// All admin routes require auth + ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// ── Dashboard Stats ─────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    // Revenue trend period: '7d' | '30d' | '12m'
    const period = (req.query.period as string) || '30d';

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      ordersByStatus,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        where: { status: { in: ['DELIVERED', 'SHIPPING', 'CONFIRMED'] } },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
      prisma.order.groupBy({ by: ['status'], _count: true }),
      prisma.product.findMany({
        where: { isActive: true, available: { lte: 5 } },
        take: 10,
        orderBy: { available: 'asc' },
        include: { images: { take: 1 } },
      }),
    ]);

    // ── Revenue Trend ───────────────────────────
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    else if (period === '12m') daysBack = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const ordersInPeriod = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { notIn: ['CANCELLED', 'REFUNDED'] },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const revenueTrend: { date: string; revenue: number; orders: number }[] = [];
    const dateMap = new Map<string, { revenue: number; orders: number }>();

    for (const o of ordersInPeriod) {
      const key =
        period === '12m'
          ? o.createdAt.toISOString().slice(0, 7) // YYYY-MM
          : o.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      const existing = dateMap.get(key) || { revenue: 0, orders: 0 };
      existing.revenue += o.total;
      existing.orders += 1;
      dateMap.set(key, existing);
    }

    // Fill in missing dates
    if (period === '12m') {
      for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - i));
        const key = d.toISOString().slice(0, 7);
        if (!dateMap.has(key)) dateMap.set(key, { revenue: 0, orders: 0 });
      }
    } else {
      for (let i = 0; i < daysBack; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (daysBack - 1 - i));
        const key = d.toISOString().slice(0, 10);
        if (!dateMap.has(key)) dateMap.set(key, { revenue: 0, orders: 0 });
      }
    }

    const sortedKeys = [...dateMap.keys()].sort();
    for (const key of sortedKeys) {
      const val = dateMap.get(key)!;
      revenueTrend.push({ date: key, revenue: val.revenue, orders: val.orders });
    }

    // ── Top Selling Products ────────────────────
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topProductDetails = await Promise.all(
      topProducts.map(async (tp: { productId: string; _sum: { quantity: number | null }; _count: number }) => {
        const product = await prisma.product.findUnique({
          where: { id: tp.productId },
          select: { name: true, price: true, images: { take: 1 } },
        });
        return {
          productId: tp.productId,
          name: product?.name ?? 'Unknown',
          totalSold: tp._sum.quantity ?? 0,
          orderCount: tp._count,
          image: product?.images?.[0]?.url ?? null,
        };
      }),
    );

    success(res, {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      ordersByStatus,
      lowStockProducts,
      revenueTrend,
      topProducts: topProductDetails,
    });
  } catch (err) {
    next(err);
  }
});

// ── Products CRUD ───────────────────────────────────
router.get('/products', async (req, res, next) => {
  try {
    const { products, total, page, limit } = await productService.listProducts(req.query as any);
    paginated(res, products, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

router.post('/products', validate(createProductSchema), async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    success(res, product, 'Product created successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', validate(updateProductSchema), async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id as string, req.body);
    success(res, product, 'Product updated successfully');
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id as string);
    success(res, null, 'Product deleted');
  } catch (err) {
    next(err);
  }
});

// ── Species CRUD ────────────────────────────────────
router.get('/species', async (req, res, next) => {
  try {
    const { species, total, page, limit } = await speciesService.listSpecies(req.query as any);
    paginated(res, species, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

router.post('/species', validate(createSpeciesSchema), async (req, res, next) => {
  try {
    const species = await speciesService.createSpecies(req.body);
    success(res, species, 'Species created successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.put('/species/:id', validate(createSpeciesSchema), async (req, res, next) => {
  try {
    const species = await speciesService.updateSpecies(req.params.id as string, req.body);
    success(res, species, 'Species updated successfully');
  } catch (err) {
    next(err);
  }
});

// ── Orders Management ───────────────────────────────
router.get('/orders', async (req, res, next) => {
  try {
    const { orders, total, page, limit } = await orderService.listAllOrders(req.query as any);
    paginated(res, orders, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string);
    success(res, order);
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id/status', validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id as string, req.body.status);
    success(res, order, 'Order status updated');
  } catch (err) {
    next(err);
  }
});

// ── Inventory Management ────────────────────────────
router.post('/products/:id/restock', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const productId = req.params.id as string;
    const product = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.product.update({
        where: { id: productId },
        data: { available: { increment: quantity } },
      });
      await tx.inventoryLog.create({
        data: {
          productId,
          action: 'ADD',
          quantity,
          note: `Restock by admin ${req.user!.userId}`,
        },
      });
      return updated;
    });

    success(res, product, `Restocked ${quantity} items`);
  } catch (err) {
    next(err);
  }
});

// ── Inventory logs ──────────────────────────────────
router.get('/inventory-logs', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '20', 10)));

    const where: any = {};
    if (req.query.productId) where.productId = req.query.productId;
    if (req.query.action) where.action = req.query.action;

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where,
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryLog.count({ where }),
    ]);

    paginated(res, logs, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// ── Users ───────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '20', 10)));

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    paginated(res, users, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

export default router;
