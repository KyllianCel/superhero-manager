import { Log } from '../models/Log';

export const logAction = async (username: string, action: string, target: string) => {
  try {
    // Création d'une nouvelle entrée dans la collection 'logs'
    await Log.create({
      username,
      action,
      target,
    });
    
    console.log(`📝 [LOG] ${username} : ${action} -> ${target}`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement du log :", error);
  }
};