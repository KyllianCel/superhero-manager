import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  // On récupère 'loading'
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20">Chargement de la session...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;