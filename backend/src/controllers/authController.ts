import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logAction } from '../utils/logger';

// --- Fonction d'Inscription (Register) ---
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà.' });
    }

    // 2. Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Créer le nouvel utilisateur
    const newUser = new User({
      username,
      passwordHash,
      role: role || 'editor', // Si aucun rôle n'est fourni, il est 'editor'
    });

    await newUser.save();

    await logAction(username, 'Inscription', 'Nouveau compte utilisateur');
    
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription', error });
  }
};

// --- Fonction de Connexion (Login) ---
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 1. Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' }); 
    }

    // 2. Comparer les mots de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // 3. Créer le Token JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET n\'est pas défini dans le .env');
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    // Le token expirera dans 1 heure
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      // 4. Envoyer le token au client
      res.status(200).json({
        token,
        user: payload.user,
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion', error });
  }
};