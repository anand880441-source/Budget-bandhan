import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getVenueCosts,
  updateVenueCost
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

// Venue costs
router.get('/venue-costs', getVenueCosts);
router.put('/venue-costs/:id', updateVenueCost);

export default router;