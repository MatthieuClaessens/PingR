import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthenticationPage from './pages/auth/AuthenticationPage';
import HomePage from './pages/home/HomePage';
import { Navbar } from './components/globals/NavBar';
import { isAuthenticated } from './services/auth/AuthenticationService';

// Le gardien de tes routes
function ProtectedRoute({ children }) {
  const location = useLocation();
  // On vérifie en direct au moment de l'accès
  return isAuthenticated() ? children : <Navigate to="/" replace state={{ from: location }} />;
}

function App() {
  // On utilise un State pour forcer React à se rafraîchir
  const [isLogged, setIsLogged] = useState(isAuthenticated());
  const location = useLocation();

  // On re-vérifie dès que l'URL change (par exemple après un login)
  useEffect(() => {
    setIsLogged(isAuthenticated());
  }, [location]);

  return (
    <div className="min-h-screen">
      {/* Maintenant la Navbar apparaîtra dès que le storage aura le token */}
      {isLogged && <Navbar />} 

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<AuthenticationPage />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to={isLogged ? "/home" : "/"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;