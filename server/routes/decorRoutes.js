import express from 'express';
import { body } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getDecorItems,
  getDecorById,
  createDecor,
  updateDecor,
  deleteDecor,
  uploadDecorImages,
  getFeaturedDecor
} from '../controllers/decorController.js';

const router = express.Router();

// Validation rules
const decorValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('function').notEmpty().withMessage('Function is required'),
  body('style').notEmpty().withMessage('Style is required'),
  body('priceRange.low').isNumeric().withMessage('Low price must be a number'),
  body('priceRange.medium').isNumeric().withMessage('Medium price must be a number'),
  body('priceRange.high').isNumeric().withMessage('High price must be a number')
];

// Public routes (protected)
router.get('/featured', protect, getFeaturedDecor);
router.get('/', protect, getDecorItems);
router.get('/:id', protect, getDecorById);

// Admin only routes
router.post('/upload', protect, admin, upload.array('images', 5), uploadDecorImages);
router.post('/', protect, admin, decorValidation, validate, createDecor);
router.put('/:id', protect, admin, decorValidation, validate, updateDecor);
router.delete('/:id', protect, admin, deleteDecor);

export default router;