import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getLogistics,
  updateLogistics,
  calculateTransportCost,
  calculateBaraatCost,
  calculateAccommodationCost
} from '../controllers/logisticsController.js';

const router = express.Router();

// Apply protect to all routes
router.use(protect);

// Test route to check if router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Logistics routes are working' });
});

// Calculation endpoints
router.post('/calculate/transport', calculateTransportCost);
router.post('/calculate/baraat', calculateBaraatCost);
router.post('/calculate/accommodation', calculateAccommodationCost);

// CRUD endpoints
router.get('/:weddingId', getLogistics);
router.post('/:weddingId', updateLogistics);

export default router;