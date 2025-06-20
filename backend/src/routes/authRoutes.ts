import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Middleware для логирования запросов
const logRequest = (req: any, res: any, next: any) => {
  console.log('🔧 [DEBUG] Auth route hit:', req.method, req.path);
  console.log('🔧 [DEBUG] Request body:', req.body);
  console.log('🔧 [DEBUG] Request headers:', req.headers);
  next();
};

// POST /api/register - User registration
router.post('/register', logRequest, validateRegistration, AuthController.register);

// POST /api/login - User login
router.post('/login', logRequest, validateLogin, AuthController.login);

// GET /api/profile - Get user profile (protected)
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router; 