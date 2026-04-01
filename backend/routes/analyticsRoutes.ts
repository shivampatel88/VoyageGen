import express from 'express';
import { getAgentAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/agent', protect, authorize('AGENT', 'ADMIN'), getAgentAnalytics);

export default router;
