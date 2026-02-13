import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { addToWishlistSchema } from '../schemas/index.js';
import * as wishlistService from '../services/wishlist.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

// GET /api/wishlist — get user's wishlist
router.get('/', async (req, res, next) => {
  try {
    const { items, total, page, limit } = await wishlistService.getUserWishlist(
      req.user!.userId,
      req.query as any,
    );
    paginated(res, items, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/wishlist/ids — get all wishlisted product IDs (for batch UI checking)
router.get('/ids', async (req, res, next) => {
  try {
    const productIds = await wishlistService.getWishlistProductIds(req.user!.userId);
    success(res, productIds);
  } catch (err) {
    next(err);
  }
});

// GET /api/wishlist/check/:productId — check if product is in wishlist
router.get('/check/:productId', async (req, res, next) => {
  try {
    const result = await wishlistService.isInWishlist(
      req.user!.userId,
      req.params.productId as string,
    );
    success(res, result);
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist — add product to wishlist
router.post('/', validate(addToWishlistSchema), async (req, res, next) => {
  try {
    const item = await wishlistService.addToWishlist(req.user!.userId, req.body.productId);
    success(res, item, 'Product added to wishlist', 201);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:productId — remove product from wishlist
router.delete('/:productId', async (req, res, next) => {
  try {
    await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId as string);
    success(res, null, 'Product removed from wishlist');
  } catch (err) {
    next(err);
  }
});

export default router;
