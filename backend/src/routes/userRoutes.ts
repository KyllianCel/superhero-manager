import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();
router.get('/', protect, adminOnly, getAllUsers);
export default router;