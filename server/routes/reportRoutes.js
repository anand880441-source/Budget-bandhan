import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  generatePDFReport,
  generateExcelReport
} from '../controllers/reportController.js';

const router = express.Router();

router.use(protect);

router.get('/pdf/:weddingId', generatePDFReport);
router.get('/excel/:weddingId', generateExcelReport);

export default router;