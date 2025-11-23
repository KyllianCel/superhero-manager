import { useEffect, useState } from 'react';
import { getAllHeroes } from '../api/heroApi';
import HeroCard from '../components/HeroCard';
import SearchBar from '../components/SearchBar';
import type { Hero } from '../types/Hero';

const Dashboard = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState('');

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const data = await getAllHeroes();
        setHeroes(data);
      } catch (err) {
        setError('Impossible de charger les héros.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  // Logique de filtrage
  const filteredHeroes = heroes.filter((hero) => {
    // Filtre par nom 
    const matchesName = hero.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par univers
    let heroUniverse = 'Autre';
    if (hero.biography.publisher?.includes('Marvel')) heroUniverse = 'Marvel';
    else if (hero.biography.publisher?.includes('DC') || hero.biography.publisher?.includes('Superman')) heroUniverse = 'DC';
    
    const matchesUniverse = selectedUniverse === '' || heroUniverse === selectedUniverse;

    return matchesName && matchesUniverse;
  });

  if (loading) return <div className="text-center mt-10 text-xl">Chargement des super-héros...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        SuperHero Manager 🦸‍♂️
      </h1>

      {/* Ajout de la barre de recherche */}
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedUniverse={selectedUniverse}
        setSelectedUniverse={setSelectedUniverse}
      />

      {/* Affichage du nombre de résultats */}
      <p className="text-gray-600 mb-4">
        {filteredHeroes.length} héros trouvé(s)
      </p>

      {/* Grille des héros filtrés */}
      {filteredHeroes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredHeroes.map((hero) => (
            <HeroCard key={hero._id} hero={hero} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          Aucun héros ne correspond à votre recherche. 🕸️
        </div>
      )}
    </div>
  );
};

export default Dashboard;