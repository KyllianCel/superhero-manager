import { Link } from 'react-router-dom';
import type { Hero } from '../types/Hero';

interface HeroCardProps {
  hero: Hero;
}

const HeroCard = ({ hero }: HeroCardProps) => {
  const imageUrl = `http://localhost:5000/uploads/${hero.images.sm}`;

  // Détermination de la couleur du badge d'alignement
  const alignmentColor =
    hero.biography.alignment === 'good'
      ? 'bg-green-100 text-green-800'
      : hero.biography.alignment === 'bad'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <Link
      to={`/hero/${hero._id}`}
      className="block transform hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      <div className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-xl h-full flex flex-col">
        <div className="relative h-64 sm:h-80 w-full bg-gray-200">
           <img
            src={imageUrl}
            alt={hero.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
        </div>
        
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 truncate">{hero.name}</h2>
            <p className="text-sm text-gray-600 truncate">
              {hero.biography.publisher || 'Éditeur inconnu'}
            </p>
          </div>

          <div className="mt-3">
            <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${alignmentColor}`}>
              {hero.biography.alignment === '-' ? 'neutral' : hero.biography.alignment}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeroCard;