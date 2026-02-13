import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { blogQuerySchema } from '../schemas/index.js';
import * as blogService from '../services/blog.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// GET /api/blogs — list published blogs (public)
router.get('/', validate(blogQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { blogs, total, page, limit } = await blogService.listPublishedBlogs(req.query as any);
    paginated(res, blogs, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/blogs/:slug — get single blog by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug as string);
    success(res, blog);
  } catch (err) {
    next(err);
  }
});

export default router;
