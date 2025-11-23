import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Hero } from '../models/Hero';

// Charger les variables d'environnement depuis la racine du backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const importData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI manquant dans .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB pour l\'importation.');

    // Lecture du fichier JSON
    const jsonPath = path.join(__dirname, '../SuperHerosComplet.json');
    
    // check pour être sûr que le fichier existe
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Fichier introuvable : ${jsonPath}`);
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const heroesData = JSON.parse(jsonData); // Le fichier JSON entier

    const heroesList = heroesData.superheros; 

    if (!Array.isArray(heroesList)) {
       throw new Error("Le fichier JSON ne contient pas un tableau 'superheros'");
    }

    // Nettoyage
    await Hero.deleteMany({});
    console.log('🗑️ Anciennes données supprimées.');

    // Préparation et insertion
    const heroesToInsert = heroesList.map((hero: any) => {
       // Logique simple pour déterminer l'univers
       let univers = 'Autre';
       const publisher = hero.biography.publisher;
       if (publisher && publisher.includes('Marvel')) univers = 'Marvel';
       if (publisher && (publisher.includes('DC') || publisher.includes('Superman'))) univers = 'DC';

       return { ...hero, univers };
    });

    await Hero.insertMany(heroesToInsert);
    console.log(`🎉 Succès ! ${heroesToInsert.length} héros importés.`);

    process.exit();
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
};

importData();