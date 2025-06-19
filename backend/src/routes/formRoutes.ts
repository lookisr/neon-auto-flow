import { Router } from 'express';
import { FormController } from '../controllers/formController.js';
import { validateCarBuyout, validateCarImport } from '../middleware/validation.js';
import { formSubmissionLimiter } from '../middleware/rateLimit.js';

const router = Router();

// POST /api/sell-car - Submit car buyout form
router.post('/sell-car', formSubmissionLimiter, validateCarBuyout, FormController.submitCarBuyout);

// POST /api/import-car - Submit car import form
router.post('/import-car', formSubmissionLimiter, validateCarImport, FormController.submitCarImport);

export default router; 