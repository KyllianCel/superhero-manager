import { Schema, model, Document } from 'mongoose';

// Interface TypeScript pour définir la structure d'un héros
export interface IHero extends Document {
  id: number;
  name: string;
  slug: string;
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  appearance: {
    gender: string;
    race: string | null;
    height: [string, string];
    weight: [string, string];
    eyeColor: string;
    hairColor: string;
  };
  biography: {
    fullName: string;
    alterEgos: string;
    aliases: string[];
    placeOfBirth: string;
    firstAppearance: string;
    publisher: string;
    alignment: string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    groupAffiliation: string;
    relatives: string;
  };
  images: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  
  univers: string; 
}

// Schéma Mongoose
const heroSchema = new Schema<IHero>({
  id: { type: Number, required: true, unique: true }, 
  name: { type: String, required: true },
  slug: { type: String },
  powerstats: {
    intelligence: { type: Number },
    strength: { type: Number },
    speed: { type: Number },
    durability: { type: Number },
    power: { type: Number },
    combat: { type: Number },
  },
  appearance: {
    gender: { type: String },
    race: { type: String },
    height: [{ type: String }],
    weight: [{ type: String }],
    eyeColor: { type: String },
    hairColor: { type: String },
  },
  biography: {
    fullName: { type: String },
    alterEgos: { type: String },
    aliases: [{ type: String }],
    placeOfBirth: { type: String },
    firstAppearance: { type: String },
    publisher: { type: String },
    alignment: { type: String },
  },
  work: {
    occupation: { type: String },
    base: { type: String },
  },
  connections: {
    groupAffiliation: { type: String },
    relatives: { type: String },
  },
  images: {
    xs: { type: String },
    sm: { type: String },
    md: { type: String },
    lg: { type: String },
  },
  univers: { type: String, default: 'Autre' },
});

// Création et exportation du modèle
export const Hero = model<IHero>('Hero', heroSchema);