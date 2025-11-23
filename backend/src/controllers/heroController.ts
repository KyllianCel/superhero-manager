import { type Request, type Response } from 'express';
import { Hero } from '../models/Hero';
import fs from 'fs';
import path from 'path';
import { logAction } from '../utils/logger';

// recuperation de tout les heros 
export const getAllHeroes = async (req: Request, res: Response) => {
  try {
    const heroes = await Hero.find().sort({ name: 1 });
    res.status(200).json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des héros', error });
  }
};

// récupération d'un héro par id 
export const getHeroById = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Héros non trouvé' });
    }
    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// création d'un héro
export const createHero = async (req: Request, res: Response) => {
  console.log("Tentative de création de héros...");

  try {
    const { name, univers, biography, powerstats, appearance, work, connections } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier image n\'a été envoyé.' });
    }

    const imagePath = `md/${req.file.filename}`;

    const newHero = new Hero({
      id: Date.now(),
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      univers: univers || 'Autre',
      powerstats: JSON.parse(powerstats || '{}'),
      appearance: JSON.parse(appearance || '{}'),
      biography: JSON.parse(biography || '{}'),
      work: JSON.parse(work || '{}'),
      connections: JSON.parse(connections || '{}'),
      images: {
        xs: imagePath,
        sm: imagePath,
        md: imagePath,
        lg: imagePath,
      },
    });

    const savedHero = await newHero.save();

    if (req.user) {
      await logAction(req.user.user.username, 'Création', savedHero.name);
    }
    
    console.log("✅ Héros créé avec succès:", savedHero.name);
    res.status(201).json(savedHero);

  } catch (error) {
    console.error("💥 ERREUR lors de la création :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du héros', error });
  }
};

// suppression d'un héros 
export const deleteHero = async (req: Request, res: Response) => {
  console.log("Tentative de suppression de héros...");

  try {
    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: 'Héros non trouvé' });
    }

    const imageName = hero.images.md.split('/').pop();
    if (imageName) {
      const imagePath = path.join(__dirname, '../uploads/md', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Image supprimée: ${imagePath}`);
      } else {
        console.warn(`Image non trouvée: ${imagePath}`);
      }
    }

    if (req.user) {
      await logAction(req.user.user.username, 'Suppression', hero.name);
    }

    await hero.deleteOne();

    console.log(`✅ Héros supprimé: ${hero.name}`);
    res.status(200).json({ message: 'Héros supprimé avec succès' });

  } catch (error) {
    console.error("💥 ERREUR lors de la suppression :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression', error });
  }
};

// modification des informations de héros 
export const updateHero = async (req: Request, res: Response) => {
  console.log("Tentative de mise à jour de héros...");
  
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Héros non trouvé' });
    }

    const { name, univers, biography, powerstats, appearance, work, connections } = req.body;

    if (req.file) {
      console.log("Nouvelle image détectée, remplacement...");
      const oldImageName = hero.images.md.split('/').pop();
      if (oldImageName) {
        const oldImagePath = path.join(__dirname, '../uploads/md', oldImageName);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const newImagePath = `md/${req.file.filename}`;
      hero.images = { xs: newImagePath, sm: newImagePath, md: newImagePath, lg: newImagePath };
    }

    hero.name = name || hero.name;
    hero.univers = univers || hero.univers;
    
    if (biography) hero.biography = JSON.parse(biography);
    if (powerstats) hero.powerstats = JSON.parse(powerstats);
    if (appearance) hero.appearance = JSON.parse(appearance);
    if (work) hero.work = JSON.parse(work);
    if (connections) hero.connections = JSON.parse(connections);
    
    hero.biography.publisher = univers || hero.biography.publisher;

    const updatedHero = await hero.save();

    if (req.user) {
      await logAction(req.user.user.username, 'Modification', updatedHero.name);
    }

    console.log(`✅ Héros mis à jour: ${updatedHero.name}`);
    res.status(200).json(updatedHero);

  } catch (error) {
    console.error("💥 ERREUR lors de la mise à jour :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour', error });
  }
};