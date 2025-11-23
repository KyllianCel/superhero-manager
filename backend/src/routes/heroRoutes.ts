import { Router } from 'express';
import { getAllHeroes, getHeroById, createHero, deleteHero, updateHero} from '../controllers/heroController'; 
import { upload } from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getAllHeroes);
router.get('/:id', getHeroById);

router.post('/', protect, upload.single('image'), createHero);

router.delete('/:id', protect, adminOnly, deleteHero);

router.put('/:id', protect, upload.single('image'), updateHero);

export default router;