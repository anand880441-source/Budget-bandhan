import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  bulkImportGuests,
  bulkUpdateRSVP,
  getGuestStats
} from '../controllers/guestController.js';

const router = express.Router();

// Validation rules
const guestValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('weddingId').notEmpty().withMessage('Wedding ID is required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone required')
];

// Apply protect to all routes
router.use(protect);

// Bulk routes
router.post('/bulk', bulkImportGuests);
router.patch('/bulk/rsvp', bulkUpdateRSVP);
router.get('/stats/:weddingId', getGuestStats);

// CRUD routes
router.route('/')
  .get(getGuests)
  .post(guestValidation, validate, createGuest);

router.route('/:id')
  .get(getGuestById)
  .put(updateGuest)
  .delete(deleteGuest);

export default router;