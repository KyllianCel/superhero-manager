import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  // Récupération des infos
  const { isAuthenticated, logout, user } = useAuth();

  const roleTraduction: { [key: string]: string } = {
    admin: 'Admin',
    editor: 'Éditeur',
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Vide le token
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <nav className="bg-gray-900 p-4 text-white mb-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* --- LOGO / TITRE --- */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:text-blue-400 transition-colors">
          <span className="text-2xl">🦸‍♂️</span> 
          <span className="hidden sm:inline">SuperHero Manager</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Lien Accueil */}
          <Link to="/" className="hover:text-gray-300 transition-colors font-medium">
            Accueil
          </Link>

          {isAuthenticated ? (
            <>
              {/* --- MENU UTILISATEUR CONNECTÉ --- */}

              {/* Bouton Ajouter */}
              <Link 
                to="/add-hero" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
              >
                + Ajouter
              </Link>
              
              {/* Bouton Admin*/}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                >
                  Admin
                </Link>
              )}
              
              {/* Section Profil & Déconnexion */}
              <div className="flex items-center gap-3 border-l border-gray-700 pl-4 ml-2">
                <div className="text-right hidden md:block">
                  <span className="block text-sm font-medium text-gray-200">{user?.username}</span>
                  <span className="block text-xs text-gray-500 uppercase font-bold">{user?.role ? roleTraduction[user.role] : ''}</span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-white border border-red-400 hover:bg-red-600 text-xs font-bold py-1 px-3 rounded transition-all"
                  title="Se déconnecter"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              {/* --- MENU VISITEUR --- */}
              <div className="flex gap-3 border-l border-gray-700 pl-4 ml-2 items-center">
                <Link to="/login" className="hover:text-white text-gray-300 text-sm font-medium">
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm transition-colors font-bold"
                >
                  Inscription
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;