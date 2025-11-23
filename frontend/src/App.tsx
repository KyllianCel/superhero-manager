import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import HeroDetails from './pages/HeroDetails';
import AddHero from './pages/AddHero';
import EditHero from './pages/EditHero';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hero/:id" element={<HeroDetails />} />            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/add-hero" element={<AddHero />} />
              <Route path="/edit-hero/:id" element={<EditHero />} />
            </Route>

            <Route element={<ProtectedAdminRoute />}>
               <Route path="/admin" element={<AdminPage />} />
            </Route>
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;