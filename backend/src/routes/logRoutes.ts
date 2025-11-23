import { Router } from 'express';
import { getLogs } from '../controllers/logController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();
router.get('/', protect, adminOnly, getLogs);
export default router;