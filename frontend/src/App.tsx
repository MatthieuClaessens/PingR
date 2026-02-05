import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import ConversationPage from "./pages/conversation/ConversationPage";
import { isAuthenticated } from "./services/authenticationService";
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-full bg-[#121212] text-[#EEEEEE] overflow-hidden">
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AuthenticationPage />} />

            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />

            <Route path="/conversation/:id" element={
              <ProtectedRoute>
                <ConversationPage />
              </ProtectedRoute>
            } />

            <Route path="/conversation" element={
              <ProtectedRoute>
                <ConversationPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}