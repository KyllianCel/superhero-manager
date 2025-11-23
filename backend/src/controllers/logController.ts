import { type Request, type Response } from 'express';
import { Log } from '../models/Log';

export const getLogs = async (req: Request, res: Response) => {
  try {
    // On récupère les 100 derniers logs, triés du plus récent au plus ancien
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération logs', error });
  }
};