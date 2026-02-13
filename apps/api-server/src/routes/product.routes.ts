import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { productQuerySchema } from '../schemas/index.js';
import * as productService from '../services/product.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// GET /api/products/new-arrivals — newest products
router.get('/new-arrivals', async (req, res, next) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
    const { products, total, page } = await productService.listProducts({
      sortBy: 'newest',
      limit: String(limit),
      page: '1',
    });
    paginated(res, products, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/best-sellers — top selling products
router.get('/best-sellers', async (req, res, next) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
    const { products, total, page } = await productService.listProducts({
      sortBy: 'popular',
      limit: String(limit),
      page: '1',
    });
    paginated(res, products, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

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
