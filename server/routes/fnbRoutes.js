import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getFnBPackages,
  getFnBPackageById,
  calculateFnBCost
} from '../controllers/fnbController.js';

const router = express.Router();

// Apply protect to all routes
router.use(protect);

// Routes
router.get('/', getFnBPackages);
router.post('/calculate', calculateFnBCost);
router.get('/:id', getFnBPackageById);

export default router;