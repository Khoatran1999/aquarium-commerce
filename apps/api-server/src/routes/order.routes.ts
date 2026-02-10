import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { createOrderSchema } from '../schemas/index.js';
import * as orderService from '../services/order.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

router.use(authenticate);

// POST /api/orders
router.post('/', validate(createOrderSchema), async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user!.userId, req.body);
    success(res, order, 'Order placed successfully', 201);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders
router.get('/', async (req, res, next) => {
  try {
    const { orders, total, page, limit } = await orderService.getUserOrders(
      req.user!.userId,
      req.query as any,
    );
    paginated(res, orders, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string, req.user!.userId);
    success(res, order);
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id as string, req.user!.userId);
    success(res, order, 'Order cancelled');
  } catch (err) {
    next(err);
  }
});

export default router;
