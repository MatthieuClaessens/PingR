import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import { ConversationPage } from "./pages/conversation/ConversationPage";
import { isAuthenticated } from "./services/auth/AuthenticationService";
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    console.warn("Accès refusé : Utilisateur non authentifié.");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function ConversationWrapper() {
  const { id } = useParams<{ id: string }>();
  const activeId = id ? parseInt(id, 10) : null;

  console.log("🛠 ConversationWrapper - ID détecté :", activeId);

  return <ConversationPage activeId={activeId} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />

        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/conversation/:id" element={
          <ProtectedRoute>
            <ConversationWrapper />
          </ProtectedRoute>
        } />

        <Route path="/conversation" element={
          <ProtectedRoute>
            <ConversationPage activeId={null} />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;