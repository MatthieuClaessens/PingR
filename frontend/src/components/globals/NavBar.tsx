"use client";

import React, { useState } from "react";
import { Bell, Settings, User, Search, LogOut, UserCircle, ShieldCheck, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import http from "../../api/http-common";
import { clearToken } from "../../services/auth/AuthenticationService";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleFriendAction = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      await http.post("/friends/request", { username: searchQuery });
      alert(`Demande envoyée à ${searchQuery} !`);
      setSearchQuery('');
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'invitation", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await http.post("auth/logout");
    } catch (err) {
      console.error("Failed to logout", err);
    } finally {
      clearToken();
      navigate('/');
      setLoading(false);
    }
  };

  return (
    <nav className="h-14 w-full bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between px-4 relative z-[100]">
      <div className="flex items-center gap-3">
        <h3 className="font-['Salsa'] text-4xl text-[#EEEEEE] cursor-pointer hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative flex items-center bg-[#121212] rounded-xl border border-[#2A2A2A] focus-within:border-[#EF3C56] transition-all p-1 pl-3 group">
          <Search className="text-[#979797] group-focus-within:text-[#EF3C56] transition-colors" size={18} />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher ou ajouter un contact..."
            className="w-full bg-transparent text-sm text-[#EEEEEE] px-3 py-1.5 outline-none placeholder:text-[#555555]"
          />

          <button 
            disabled={!searchQuery || loading}
            onClick={handleFriendAction}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-white text-xs font-bold transition-all shadow-lg whitespace-nowrap
              ${searchQuery 
                ? 'bg-[#EF3C56] hover:bg-[#c22f44] opacity-100 translate-x-0' 
                : 'bg-[#2A2A2A] opacity-0 translate-x-2 pointer-events-none'
              }`}
          >
            <UserPlus size={14} /> 
            <span>{loading ? "..." : "Ajouter"}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        <Settings className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />

        <div className="h-8 w-px bg-[#2A2A2A] mx-1" />

        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-2 cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${isOpen ? 'border-[#EF3C56] bg-[#2A2A2A]' : 'border-[#3A3A3A] bg-[#2A2A2A] group-hover:border-[#EF3C56]'}`}>
              <User size={18} className={`${isOpen ? 'text-[#EF3C56]' : 'text-[#979797] group-hover:text-[#EF3C56]'}`} />
            </div>
            <span className="text-sm font-medium text-[#979797] group-hover:text-[#EEEEEE] hidden sm:block">
              Mon Profil
            </span>
          </div>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-3 w-52 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-3 border-b border-[#2A2A2A] bg-[#1E1E1E]/50">
                  <p className="text-xs font-bold text-[#EF3C56] uppercase tracking-tighter">Utilisateur</p>
                  <p className="text-sm text-[#EEEEEE] font-medium truncate">Besique Monroe</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#979797] hover:text-[#EEEEEE] hover:bg-[#2A2A2A] rounded-lg transition">
                    <UserCircle size={16} /> Mon Compte
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#979797] hover:text-[#EEEEEE] hover:bg-[#2A2A2A] rounded-lg transition">
                    <ShieldCheck size={16} /> Mappings & Rôles
                  </button>
                  <div className="h-px bg-[#2A2A2A] my-1 mx-2" />
                  <button 
                    onClick={logout}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF3C56] hover:bg-[#EF3C56]/10 rounded-lg transition disabled:opacity-50"
                  >
                    <LogOut size={16} /> {loading ? "Déconnexion..." : "Déconnexion"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};