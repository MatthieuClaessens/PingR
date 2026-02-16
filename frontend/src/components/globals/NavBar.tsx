"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, Search, User, LogOut, 
  ShieldCheck, MessageSquare 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import http from "../../api/http-common";
import { clearToken } from "../../services/authenticationService";

interface UserSearchResult {
  accountId: number;
  accountName: string;
  role: string;
}

interface NavbarProps {
  onSelectConv?: (id: number) => void;
}

export const NavBar = ({ onSelectConv }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const searchUsers = async (query: string) => {
    try {
      const response = await http.get<UserSearchResult[]>(`/user/search?q=${query}`);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (err) {
      console.error("Erreur API:", err);
      setSearchResults([]);
    }
  };

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

  const handleStartChat = async (targetId: number) => {
    try {
      const response = await http.post("/conversations", {
        accountIds: [targetId] 
      });

      const conversation = response.data;
      const convId = conversation.conversationId || conversation.id;

      if (!convId) throw new Error("ID absent");

      setSearchQuery('');
      setShowResults(false);
      navigate(`/conversation/${convId}`);
      if (onSelectConv) onSelectConv(convId);
      
    } catch (err) {
      console.error("Erreur discussion :", err);
    }
  };

  return (
    <nav className="h-14 w-full bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between px-4 relative z-50">
      
      <div className="flex items-center gap-3">
        <h3 onClick={() => navigate('/home')} className="font-['Salsa'] text-4xl text-[#EEEEEE] cursor-pointer hover:scale-105 transition duration-300">
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
        </div>

        {showResults && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50 shadow-black/80 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartChat(user.accountId)}
                    className="p-2 text-[#979797] hover:text-[#EF3C56] rounded-lg transition-colors bg-[#2A2A2A]/0 hover:bg-[#EF3C56]/10"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-[#555555]">Aucun résultat</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Bell size={20} className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition-colors" />
        
        <div className="relative">
          <div 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center cursor-pointer border border-transparent hover:border-[#EF3C56] transition-all"
          >
            <User size={20} className="text-[#979797]" />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[#2A2A2A]">
                <p className="text-sm text-[#EEEEEE] font-bold">Mon Profil</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#EF3C56] hover:bg-[#EF3C56]/10 transition-colors"
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};