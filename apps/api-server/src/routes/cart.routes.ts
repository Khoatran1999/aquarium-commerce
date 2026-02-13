import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { addToCartSchema, updateCartItemSchema } from '../schemas/index.js';
import * as cartService from '../services/cart.service.js';
import { success } from '../utils/response.js';

const router = Router();

// All cart routes require auth
router.use(authenticate);

// GET /api/cart
router.get('/', async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user!.userId);
    success(res, cart);
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/items
router.post('/items', validate(addToCartSchema), async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(
      req.user!.userId,
      req.body.productId,
      req.body.quantity,
    );
    success(res, cart, 'Added to cart');
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/items/:itemId
router.patch('/items/:itemId', validate(updateCartItemSchema), async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(
      req.user!.userId,
      req.params.itemId as string,
      req.body.quantity,
    );
    success(res, cart);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/items/:itemId
router.delete('/items/:itemId', async (req, res, next) => {
  try {
    const cart = await cartService.removeCartItem(req.user!.userId, req.params.itemId as string);
    success(res, cart);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart
router.delete('/', async (req, res, next) => {
  try {
    await cartService.clearCart(req.user!.userId);
    success(res, null, 'Cart cleared');
  } catch (err) {
    next(err);
  }
});

export default router;
