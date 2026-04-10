import { Router } from 'express';
import { login, register, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// AUTH ROUTES
router.post('/login', login);
router.post('/register', register);
router.get('/me', authMiddleware, me);

export default router;