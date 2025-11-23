import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

export default router;