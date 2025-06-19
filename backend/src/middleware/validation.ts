import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔧 [DEBUG] Validation middleware called for:', req.path);
  console.log('🔧 [DEBUG] Request body:', req.body);
  
  const errors = validationResult(req);
  console.log('🔧 [DEBUG] Validation errors:', errors.array());
  
  if (!errors.isEmpty()) {
    console.log('🔧 [DEBUG] Validation failed, returning error response');
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  
  console.log('🔧 [DEBUG] Validation passed, calling next()');
  next();
};

export const validateCarBuyout = [
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('desiredPrice').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  handleValidationErrors
];

export const validateCarImport = [
  body('carType').trim().notEmpty().withMessage('Car type is required'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be positive'),
  body('deliveryCity').trim().notEmpty().withMessage('Delivery city is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  handleValidationErrors
];

export const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

export const validateAdvertisement = [
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('contacts').trim().notEmpty().withMessage('Contacts are required'),
  body('engineVolume').isFloat({ min: 0.5, max: 10 }).withMessage('Engine volume must be between 0.5 and 10 liters'),
  body('mileage').isInt({ min: 0 }).withMessage('Mileage must be positive'),
  body('ownersCount').isInt({ min: 1, max: 20 }).withMessage('Owners count must be between 1 and 20'),
  body('isDamaged').isBoolean().withMessage('Damage status must be boolean'),
  body('transmission').isIn(['manual', 'automatic', 'robot', 'variator']).withMessage('Invalid transmission type'),
  body('fuelType').isIn(['gasoline', 'diesel', 'hybrid', 'electric', 'lpg']).withMessage('Invalid fuel type'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  handleValidationErrors
]; 