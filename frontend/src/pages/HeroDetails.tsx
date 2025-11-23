import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Hero } from '../types/Hero';
import { deleteHero } from '../api/heroApi';
import { useAuth } from '../context/AuthContext';

const TableRow = ({ label, value }: { label: string; value: string | number | string[] | undefined }) => (
  <div className="flex border-b border-gray-200 last:border-b-0 py-2 px-4 even:bg-gray-50">
    <span className="font-semibold w-1/3 text-gray-700">{label} :</span>
    <span className="w-2/3 text-gray-900">
      {Array.isArray(value) ? value.join(', ') : value || '-'}
    </span>
  </div>
);

// Composant pour une section
const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b-2 border-blue-500 inline-block pb-1">
      {title}
    </h2>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {children}
    </div>
  </div>
);

const HeroDetails = () => {
  const alignementTraduction: { [key: string]: string } = {
    good: 'Bien',
    bad: 'Mal',
    neutral: 'Neutre',
    '-': 'Inconnu'
  };
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); 
  
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/heroes/${id}`);
        setHero(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement du héros", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHero();
  }, [id]);

  const handleDelete = async () => {
    if (!hero) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${hero.name} ?`)) {
      try {
        await deleteHero(hero._id);
        navigate('/'); 
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setError('Impossible de supprimer le héros.');
      }
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl">Chargement...</div>;
  if (!hero) return <div className="text-center mt-10 text-xl text-red-500">Héros non trouvé</div>;

  const imageUrl = `http://localhost:5000/uploads/${hero.images.lg}`;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Retour au tableau de bord
      </Link>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-xl shadow-lg">
        {/* Colonne Gauche : Image + Titre Principal */}
        <div className="lg:w-1/3 flex-shrink-0">
          <div className="sticky top-6">
            <div className="rounded-xl overflow-hidden shadow-md mb-4">
              <img src={imageUrl} alt={hero.name} className="w-full h-auto object-cover" />
            </div>
            <h1 className="text-4xl font-extrabold text-center text-gray-900">{hero.name}</h1>
            
            {/* Badges Univers et Alignement */}
            <div className="mt-4 flex justify-center flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {hero.biography?.publisher || 'Inconnu'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                ${hero.biography?.alignment === 'good' ? 'bg-green-100 text-green-800' : 
                  hero.biography?.alignment === 'bad' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                {alignementTraduction[hero.biography?.alignment || '-'] || hero.biography?.alignment}
              </span>
            </div>

            {/* Boutons d'action (Visibles seulement si connecté) */}
            {isAuthenticated && (
              <div className="mt-6 flex gap-4">
                <Link
                  to={`/edit-hero/${hero._id}`}
                  className="flex-1 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-center"
                >
                  Modifier
                </Link>
                
                {/* Seul l'admin peut voir le bouton Supprimer */}
                {user?.role === 'admin' && (
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Colonne Droite : Détails en Tableaux */}
        <div className="lg:w-2/3">
          
          <InfoSection title="Apparence">
            <TableRow label="Genre" value={hero.appearance?.gender} />
            <TableRow label="Race" value={hero.appearance?.race} />
            <TableRow label="Taille" value={hero.appearance?.height} />
            <TableRow label="Poids" value={hero.appearance?.weight} />
            <TableRow label="Yeux" value={hero.appearance?.eyeColor} />
            <TableRow label="Cheveux" value={hero.appearance?.hairColor} />
          </InfoSection>

          <InfoSection title="Biographie">
            <TableRow label="Nom complet" value={hero.biography?.fullName} />
            <TableRow label="Alter Egos" value={hero.biography?.alterEgos} />
            <TableRow label="Alias" value={hero.biography?.aliases?.join(', ')} />
            <TableRow label="Lieu de naissance" value={hero.biography?.placeOfBirth} />
            <TableRow label="Première apparition" value={hero.biography?.firstAppearance} />
            <TableRow label="Éditeur" value={hero.biography?.publisher} />
          </InfoSection>

          <InfoSection title="Superpouvoirs (Stats)">
            <TableRow label="Intelligence" value={hero.powerstats?.intelligence} />
            <TableRow label="Force" value={hero.powerstats?.strength} />
            <TableRow label="Vitesse" value={hero.powerstats?.speed} />
            <TableRow label="Durabilité" value={hero.powerstats?.durability} />
            <TableRow label="Pouvoir" value={hero.powerstats?.power} />
            <TableRow label="Combat" value={hero.powerstats?.combat} />
          </InfoSection>

           <InfoSection title="Travail & Connexions">
            <TableRow label="Occupation" value={hero.work?.occupation} />
            <TableRow label="Base" value={hero.work?.base} />
            <TableRow label="Affiliations" value={hero.connections?.groupAffiliation} />
            <TableRow label="Proches" value={hero.connections?.relatives} />
          </InfoSection>

        </div>
      </div>
    </div>
  );
};

export default HeroDetails;