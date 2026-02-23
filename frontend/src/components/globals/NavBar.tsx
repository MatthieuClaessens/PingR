"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell, Search, User, Menu,
  ShieldCheck, MessageSquare,
  Power
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
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  onSearchResults?: (results: any[]) => void;
  onClearSearch?: () => void;
}

export const NavBar = ({
  onSelectConv,
  onMenuClick,
  showMenuButton = false,
  onSearchResults,
  onClearSearch
}: NavbarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

      if (onSearchResults) {
        onSearchResults(response.data);
      }
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
        if (onClearSearch) onClearSearch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStartChat = async (targetId: number) => {
    try {
      const response = await http.post("/conversations", { accountIds: [targetId] });
      const conversation = response.data;
      const convId = conversation.conversationId || conversation.id;

      setSearchQuery('');
      setShowResults(false);

      navigate(`/conversation/${convId}`);
      if (onSelectConv) onSelectConv(convId);
    } catch (err) {
      console.error("Erreur discussion :", err);
    }
  };

  return (
    <nav className="h-16 w-full bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between px-3 sm:px-6 relative z-50 gap-3">

      <div className="flex items-center gap-2 shrink-0">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <Menu size={22} className="text-[#EEEEEE]" />
          </button>
        )}

        <h3
          onClick={() => navigate('/home')}
          className="font-['Salsa'] text-2xl sm:text-3xl text-[#EEEEEE] cursor-pointer hover:opacity-80 transition shrink-0"
        >
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>

      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative flex items-center bg-[#121212] rounded-xl border border-[#2A2A2A] focus-within:border-[#EF3C56]/50 transition-all p-1 pl-3 group">
          <Search className="text-[#555555] group-focus-within:text-[#EF3C56] transition-colors shrink-0" size={16} />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full bg-transparent text-sm text-[#EEEEEE] px-2 sm:px-3 py-1.5 outline-none placeholder:text-[#555555] min-w-0"
          />
        </div>

        {showResults && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200 w-[calc(100vw-2rem)] sm:w-full max-sm:-left-8">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.accountId}
                  onClick={() => handleStartChat(user.accountId)}
                  className="flex items-center justify-between p-3 hover:bg-[#222222] cursor-pointer transition-colors border-b border-[#2A2A2A] last:border-0 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center font-bold text-[#EF3C56] text-xs">
                      {user.accountName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#EEEEEE] flex items-center gap-2 truncate">
                        {user.accountName}
                        {user.role === 'ADMIN' && <ShieldCheck size={12} className="text-[#EF3C56]" />}
                      </p>
                    </div>
                  </div>
                  <MessageSquare size={16} className="text-[#555555] group-hover:text-[#EF3C56] transition-colors shrink-0" />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-[#555555]">Aucun utilisateur trouvé</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="p-2 text-[#979797] hover:text-[#EEEEEE] transition-colors hidden xs:block">
          <Bell size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center border border-transparent hover:border-[#EF3C56]/50 transition-all active:scale-95 shadow-lg"
          >
            <User size={18} className="text-[#979797]" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-[#2A2A2A] bg-[#121212]/50">
                <p className="text-[10px] uppercase tracking-widest text-[#555555] font-bold">Session</p>
                <p className="text-sm text-[#EEEEEE] font-medium truncate">Mon Compte</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#EF3C56] hover:bg-[#EF3C56]/10 transition-colors text-left"
              >
                <Power size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};