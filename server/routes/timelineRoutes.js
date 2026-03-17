import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTimeline,
  updateTimeline,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem
} from '../controllers/timelineController.js';

const router = express.Router();

router.use(protect);

router.get('/:weddingId', getTimeline);
router.put('/:weddingId', updateTimeline);
router.post('/:weddingId/items', addTimelineItem);
router.put('/:weddingId/items/:itemId', updateTimelineItem);
router.delete('/:weddingId/items/:itemId', deleteTimelineItem);

export default router;