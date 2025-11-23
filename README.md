# 🦸‍♂️ SuperHero Manager

Une application Full-Stack pour gérer une base de données de super-héros, développée avec la stack MERN (MongoDB, Express, React, Node.js) et TypeScript.

# 🛠️ Installation et Démarrage

Prérequis : Node.js et MongoDB installés sur votre machine.

# 1. Installation des dépendances

À la racine du projet, installez les dépendances pour le backend et le frontend :

# Installation Backend
```
cd backend
npm install
```

# Installation Frontend
```
cd ../frontend
npm install
```

# 2. Configuration

Créez un fichier .env dans le dossier backend/ avec les variables suivantes :
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/superheromanager
JWT_SECRET=votre_super_secret_jwt
```

# 3. Importation des Données (Seed)

Pour remplir la base de données avec les 500+ héros initiaux :

# Depuis le dossier backend
```
npx ts-node src/utils/seedDatabase.ts
```

# 4. Lancement du projet

Il faut lancer le backend et le frontend dans deux terminaux séparés.

Terminal 1 (Backend) :
```
cd backend
npm run dev
```

Terminal 2 (Frontend) :
```
cd frontend
npm run dev
```

L'application sera accessible sur http://localhost:5173.

Architecture Technique

Frontend : React, TypeScript, Vite, Tailwind CSS, Formik, Yup, Axios.

Backend : Node.js, Express, TypeScript, Multer (Upload).

Base de données : MongoDB (Local).

Sécurité : JWT (JSON Web Token), Bcryptjs (Hachage mdp).
