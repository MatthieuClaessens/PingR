"use client";

import React, { useState } from "react";
import { NavBar } from "../../components/globals/NavBar";
import Contacts from "../../components/home/Contacts";
import { Sidebar } from "../../components/globals/SideBar";

interface UserSearchResult {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  isFriend?: boolean;
}

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const myId = 1; 

  return (
    <main className="flex flex-col h-screen bg-[#1E1E1E] text-[#EEEEEE] overflow-hidden">

      <NavBar 
        showMenuButton={true}
        onMenuClick={() => setIsSidebarOpen(true)}
        onSearchResults={(results: any) => {
          setSearchResults(results);
          setShowSearchResults(results.length > 0);
        }}
        onClearSearch={() => {
          setSearchResults([]);
          setShowSearchResults(false);
        }}
      />

      <div className="flex flex-1 overflow-hidden relative">
        
        <Sidebar 
          myId={myId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8 sm:px-8">
          {showSearchResults ? (
            <SearchResults 
              results={searchResults} 
              onClose={() => {
                setShowSearchResults(false);
                setSearchResults([]);
              }}
            />
          ) : (
            <Contacts />
          )}
        </div>
      </div>
    </main>
  );
}

interface SearchResultsProps {
  results: UserSearchResult[];
  onClose: () => void;
}

function SearchResults({ results, onClose }: SearchResultsProps) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Résultats de recherche</h2>
            <span className="bg-[#EF3C56] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
              {results.length}
            </span>
          </div>
          <p className="text-sm text-[#979797] mt-1">Utilisateurs trouvés sur PingR</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 text-sm text-[#979797] hover:text-[#EEEEEE] hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-[#2A2A2A]"
        >
          ✕ Fermer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {results.map((user) => (
          <div
            key={user.id}
            className="group flex items-center justify-between p-4 rounded-xl hover:bg-[#252525] transition duration-200 border border-[#2A2A2A]/50 hover:border-[#EF3C56]/30"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center font-bold text-[#EF3C56] text-lg shadow-inner">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="font-semibold text-[#EEEEEE] group-hover:text-white transition-colors">
                  {user.username}
                </h3>
                {user.email && <span className="text-xs text-[#555555]">{user.email}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user.isFriend ? (
                <span className="text-xs text-[#4ADE80] font-medium px-4 py-2 bg-[#4ADE80]/10 rounded-lg border border-[#4ADE80]/20">
                  Déjà ami
                </span>
              ) : (
                <button className="px-5 py-2 bg-[#EF3C56] hover:bg-[#D6354D] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-[#EF3C56]/10 active:scale-95">
                  Ajouter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}