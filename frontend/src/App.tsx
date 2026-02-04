import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import ConversationPage from "./pages/conversation/ConversationPage";
import Sidebar from "./components/globals/SideBar";
import { isAuthenticated } from "./services/auth/authenticationService";
import './App.css';

export default function App() {
  const auth = isAuthenticated();

  return (
    <BrowserRouter>
      <div className="flex h-screen w-full bg-[#121212] text-[#EEEEEE] overflow-hidden">
        {auth}
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AuthenticationPage />} />

            <Route path="/home" element={auth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/conversation/:id" element={auth ? <ConversationPage /> : <Navigate to="/" />} />
            <Route path="/conversation" element={auth ? <ConversationPage /> : <Navigate to="/" />} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}