import express from 'express';
import { body } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
  getFeaturedArtists,
  searchArtists
} from '../controllers/artistController.js';

const router = express.Router();

// Validation rules
const artistValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priceRange.low').isNumeric().withMessage('Low price must be a number'),
  body('priceRange.medium').isNumeric().withMessage('Medium price must be a number'),
  body('priceRange.high').isNumeric().withMessage('High price must be a number')
];

// Public routes (protected)
router.get('/featured', protect, getFeaturedArtists);
router.get('/search', protect, searchArtists);
router.get('/', protect, getArtists);
router.get('/:id', protect, getArtistById);

// Admin only routes
router.post('/', protect, admin, artistValidation, validate, createArtist);
router.put('/:id', protect, admin, artistValidation, validate, updateArtist);
router.delete('/:id', protect, admin, deleteArtist);

export default router;