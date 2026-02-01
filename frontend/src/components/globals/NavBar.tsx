"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, Settings, User, Search, LogOut, UserCircle, 
  ShieldCheck, X, UserPlus, MessageSquare, MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import http from "../../api/http-common";
import { clearToken } from "../../services/auth/AuthenticationService";

interface NavbarProps {
  onSelectConv: (id: number) => void;
}

export const Navbar = ({ onSelectConv }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    try {
      const response = await http.get(`/user/search?q=${query}`);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (err) {
      console.error("X Erreur API:", err);
      setSearchResults([]);
    }
  };

const handleStartChat = async (targetId: number) => {
    try {
      setLoading(true);
      console.log("📡 Envoi POST /conversations avec targetId:", targetId);

      const response = await http.post("/conversations", {
        accountIds: [targetId] 
      });

      const conversation = response.data;
      
      const convId = conversation.conversationId || conversation.id;

      if (!convId) {
        console.error("❌ Structure DTO reçue inconnue :", conversation);
        throw new Error("L'ID de la conversation est absent.");
      }

      console.log("✅ Redirection vers la conv n° :", convId);

      setSearchQuery('');
      setShowResults(false);

      navigate(`/conversation/${convId}`);
      
      if (onSelectConv) onSelectConv(convId);
      
    } catch (err: any) {
      console.error("X Erreur lors du lancement de la discussion :", err.response?.data || err.message);
      alert("Erreur. Vérifie si tu n'essaies pas de créer un doublon ou si le serveur répond.");
    } finally {
      setLoading(false);
    }
};

  return (
    <nav className="h-14 w-full bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between px-4 relative z-[100]">
      
      <div className="flex items-center gap-3">
        <h3 onClick={() => navigate('/')} className="font-['Salsa'] text-4xl text-[#EEEEEE] cursor-pointer hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>

      <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
        <div className="relative flex items-center bg-[#121212] rounded-xl border border-[#2A2A2A] focus-within:border-[#EF3C56] transition-all p-1 pl-3 group">
          <Search className="text-[#979797] group-focus-within:text-[#EF3C56] transition-colors" size={18} />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full bg-transparent text-sm text-[#EEEEEE] px-3 py-1.5 outline-none placeholder:text-[#555555]"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowResults(false); }} className="p-1.5 text-[#979797] hover:text-[#EEEEEE] hover:bg-[#2A2A2A] rounded-lg transition">
              <X size={16} />
            </button>
          )}
        </div>

        {showResults && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-[110]">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.accountId} className="flex items-center justify-between p-3 hover:bg-[#222222] transition-colors border-b border-[#2A2A2A] last:border-0 group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center font-bold text-[#EF3C56]">
                      {user.accountName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#EEEEEE] flex items-center gap-2">
                        {user.accountName}
                        {user.role === 'ADMIN' && <ShieldCheck size={12} className="text-[#EF3C56]" />}
                      </p>
                      <p className="text-[10px] text-[#979797] uppercase tracking-widest font-semibold">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      title="Message" 
                      onClick={(e) => { e.stopPropagation(); handleStartChat(user.accountId); }}
                      className="p-2 text-[#979797] hover:text-[#EEEEEE] hover:bg-[#333333] border border-transparent hover:border-[#3A3A3A] rounded-lg transition-all"
                    >
                      <MessageSquare size={16} />
                    </button>
                    
                    <button 
                      title="Ajouter en ami" 
                      onClick={(e) => { e.stopPropagation(); console.log("Add:", user.accountId); }}
                      className="p-2 text-[#979797] hover:text-[#EF3C56] hover:bg-[#EF3C56]/10 border border-transparent hover:border-[#EF3C56]/20 rounded-lg transition-all"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-[#555555]">Aucun résultat</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        <Settings className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        <div className="h-8 w-px bg-[#2A2A2A] mx-1" />

        <div className="relative">
          <div onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 pl-2 cursor-pointer group">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${isOpen ? 'border-[#EF3C56] bg-[#2A2A2A]' : 'border-transparent bg-[#2A2A2A] group-hover:border-[#EF3C56]'}`}>
              <User size={20} className={isOpen ? 'text-[#EF3C56]' : 'text-[#979797] group-hover:text-[#EF3C56]'} />
            </div>
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-[#2A2A2A] bg-[#1E1E1E]/50">
                <p className="text-xs font-bold text-[#EF3C56] uppercase">Connecté</p>
                <p className="text-sm text-[#EEEEEE] font-bold truncate underline decoration-[#EF3C56]">Mon Profil</p>
              </div>
              <div className="p-1">
                <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF3C56] hover:bg-[#EF3C56]/10 rounded-lg transition font-medium">
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};