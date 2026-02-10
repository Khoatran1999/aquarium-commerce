import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { createReviewSchema } from '../schemas/index.js';
import * as reviewService from '../services/review.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { reviews, total, page, limit } = await reviewService.getProductReviews(
      req.params.productId as string,
      req.query as any,
    );
    paginated(res, reviews, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews
router.post('/', authenticate, validate(createReviewSchema), async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user!.userId, req.body);
    success(res, review, 'Review submitted successfully', 201);
  } catch (err) {
    next(err);
  }
});

export default router;
