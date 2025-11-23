import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20">Vérification des droits...</div>;
  }

  // 1. Si pas connecté -> Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si connecté mais PAS admin -> Accueil (ou page 403)
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Si Admin -> C'est bon, on affiche la page
  return <Outlet />;
};

export default ProtectedAdminRoute;