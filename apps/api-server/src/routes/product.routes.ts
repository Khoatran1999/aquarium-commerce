import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { productQuerySchema } from '../schemas/index.js';
import * as productService from '../services/product.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// GET /api/products
router.get('/', validate(productQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { products, total, page, limit } = await productService.listProducts(req.query as any);
    paginated(res, products, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug as string);
    success(res, product);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id/related
router.get('/:id/related', async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id as string);
    const related = await productService.getRelatedProducts(
      req.params.id as string,
      product.speciesId,
    );
    success(res, related);
  } catch (err) {
    next(err);
  }
});

export default router;
