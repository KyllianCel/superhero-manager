import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';

// On étend l'interface Request pour qu'elle accepte un champ 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface DecodedToken {
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // Vérifier si le header Authorization existe et commence par 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Non autorisé, token manquant' });
        return;
      }

      const secret = process.env.JWT_SECRET as string;
      
      if (!secret) {
         throw new Error("La variable JWT_SECRET n'est pas définie dans le .env");
      }

      // Vérification du token
      const decoded = jwt.verify(token, secret) as unknown as DecodedToken;

      // On ajoute l'utilisateur décodé à la requête
      req.user = decoded;

      next(); 
    } catch (error) {
      console.error(error);
      // Si le token est expiré ou invalide, on renvoie une erreur 401
      res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  } else {
    res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};