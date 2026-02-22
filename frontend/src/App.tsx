import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import ConversationPage from "./pages/conversation/ConversationPage";
import { isAuthenticated, getUserInfo } from "./services/authenticationService";
import './App.css';
import { DashboardPage } from "./pages/dashboard/DashboardPage";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

const StaffRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = isAuthenticated();
  const user = getUserInfo();
  const role = user?.role?.toUpperCase();

  if (!isAuth) return <Navigate to="/" replace />;
  
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
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
            <Route path="/dashboard" element={
              <StaffRoute>
                <DashboardPage />
              </StaffRoute>
            } />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}