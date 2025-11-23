import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // On vérifie que l'URI est bien définie dans le .env
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI n\'est pas défini dans le fichier .env');
    }

    // On tente la connexion
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connecté: ${conn.connection.host}`);
  } catch (error) {
    // Gestion des erreurs
    if (error instanceof Error) {
      console.error(`Erreur: ${error.message}`);
    } else {
      console.error('Une erreur inconnue est survenue lors de la connexion à MongoDB');
    }
    process.exit(1); // On arrête le serveur si la base de données ne répond pas
  }
};

export default connectDB;