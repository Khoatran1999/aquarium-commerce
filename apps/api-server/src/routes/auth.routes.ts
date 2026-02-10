import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../schemas/index.js';
import * as authService from '../services/auth.service.js';
import { success } from '../utils/response.js';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    success(res, result, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user!.userId);
    success(res, user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user!.userId, req.body);
    success(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
});

export default router;
