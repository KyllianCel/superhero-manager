import { type Request, type Response, type NextFunction } from 'express';

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  // On vérifie simplement le rôle sans afficher tout l'objet dans la console
  if (req.user && req.user.user && req.user.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs' });
  }
}; 