import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import './App.css';
import { isAuthenticated } from "./services/auth/AuthenticationService";
import { ConversationPage } from "./pages/conversation/ConversationPage";


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticationPage/>} />
          <Route path="/home" element={    
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/conversation" element={    
          <ProtectedRoute>
            <ConversationPage /> 
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;