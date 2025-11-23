import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; 
import connectDB from './config/db';
import heroRoutes from './routes/heroRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import logRoutes from './routes/logRoutes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/heroes', heroRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test
app.get('/', (req: Request, res: Response) => {
  res.send('Serveur SuperHeroManager est en marche !');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});