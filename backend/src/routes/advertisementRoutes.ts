import { Router } from 'express';
import { AdvertisementController } from '../controllers/advertisementController.js';
import { validateAdvertisement } from '../middleware/validation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = Router();

// GET /api/get-ads - Get all advertisements (public)
router.get('/get-ads', apiLimiter, AdvertisementController.getAllAdvertisements);

// GET /api/get-ads/:id - Get specific advertisement (public)
router.get('/get-ads/:id', apiLimiter, AdvertisementController.getAdvertisementById);

// POST /api/post-ad - Create new advertisement (protected)
router.post(
  '/post-ad', 
  apiLimiter, 
  authenticateToken, 
  upload.array('photos', 10), // Поле 'photos' для загрузки до 10 файлов
  handleUploadError,
  validateAdvertisement, 
  AdvertisementController.createAdvertisement
);

// GET /api/my-ads - Get user's advertisements (protected)
router.get('/my-ads', apiLimiter, authenticateToken, AdvertisementController.getAdvertisementsByUser);

// Маршруты для модерации (только для админов)
// GET /api/moderate/pending - Get pending advertisements
router.get('/moderate/pending', apiLimiter, requireAdmin, AdvertisementController.getPendingAdvertisements);

// POST /api/moderate/:id - Moderate advertisement (approve/reject)
router.post('/moderate/:id', apiLimiter, requireAdmin, AdvertisementController.moderateAdvertisement);

// PUT /api/moderate/:id - Update advertisement by moderator
router.put('/moderate/:id', apiLimiter, requireAdmin, AdvertisementController.updateAdvertisementByModerator);

// DELETE /api/advertisements/:id - Delete advertisement (admin/moderator only)
router.delete('/advertisements/:id', apiLimiter, requireAdmin, AdvertisementController.deleteAdvertisement);

// DELETE /api/advertisements/:id/photos/:filename - Delete photo from advertisement
router.delete(
  '/advertisements/:id/photos/:filename',
  apiLimiter,
  authenticateToken,
  AdvertisementController.deletePhoto
);

export default router; 