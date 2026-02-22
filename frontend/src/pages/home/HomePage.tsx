"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/globals/NavBar";
import { Sidebar } from "../../components/globals/SideBar";
import http from "../../api/http-common";
import { getMyId } from "../../services/authenticationService";
import { 
  Users, 
  MessageCircle, 
  Activity, 
  ArrowUpRight,
  Search
} from "lucide-react";
import type { Conversation } from "../../entities/conversation";

export default function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const myId = getMyId() ?? 0;

  useEffect(() => {
    http.get("/conversations/all")
      .then(res => {
        const data = res.data.content || res.data;
        setConversations(data);
      })
      .catch(err => console.error("Erreur chargement HomePage:", err));
  }, []);

  const handleResume = () => {
    const lastId = sessionStorage.getItem("lastConvId");
    
    if (lastId) {
      navigate(`/conversation/${lastId}`);
    } else if (conversations.length > 0) {
      navigate(`/conversation/${conversations[0].conversationId}`);
    } else {
      setIsSidebarOpen(true);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#080808] text-[#EEEEEE] font-sans selection:bg-[#EF3C56]/30">
      <NavBar 
        showMenuButton={true}
        onMenuClick={() => setIsSidebarOpen(true)}
        onSearchResults={(results) => {
          setSearchResults(results);
          setShowSearchResults(results.length > 0);
        }}
        onClearSearch={() => setShowSearchResults(false)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          myId={myId} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          conversations={conversations} 
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar lg:ml-80 border-l border-[#151515]">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto h-full">
            
            {showSearchResults ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 rounded-lg bg-[#EF3C56]/10 flex items-center justify-center border border-[#EF3C56]/20">
                    <Search size={16} className="text-[#EF3C56]" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Explorer le réseau</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((user: any) => (
                    <div 
                      key={user.id}
                      onClick={() => navigate(`/conversation/new/${user.id}`)}
                      className="group p-5 bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#EF3C56]/50 transition-all cursor-pointer rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#151515] border border-[#222] flex items-center justify-center text-[#EF3C56] font-bold text-xl">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-white transition-colors">{user.username}</h3>
                          <p className="text-xs text-[#555] font-mono lowercase">{user.email || 'user@pingr.app'}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={18} className="text-[#333] group-hover:text-[#EF3C56] transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
                <div className="md:col-span-2 space-y-6">
                  <div className="p-8 bg-gradient-to-br from-[#0D0D0D] to-[#080808] border border-[#1A1A1A] rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Activity size={120} className="text-[#EF3C56]" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EF3C56] bg-[#EF3C56]/10 px-3 py-1 rounded-full border border-[#EF3C56]/20">
                        Système Actif
                      </span>
                      <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mt-6 mb-4 leading-tight">
                        Prêt pour le <br />prochain <span className="text-[#EF3C56]">Ping ?</span>
                      </h1>
                      <p className="text-[#666] max-w-sm text-sm leading-relaxed">
                        Recherche tes contacts via la barre supérieure pour lancer une discussion sécurisée.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[2rem] group hover:border-[#EF3C56]/30 transition-all">
                      <Users className="text-[#333] group-hover:text-[#EF3C56] mb-4 transition-colors" size={24} />
                      <p className="text-3xl font-black text-white">{conversations.length}</p>
                      <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mt-1">Discussions actives</p>
                    </div>
                    
                    <div 
                      onClick={handleResume}
                      className="p-6 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[2rem] group hover:border-orange-500/30 transition-all cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="text-orange-500/50 group-hover:text-orange-500 mb-4 transition-colors" size={24} />
                      <p className="text-2xl font-bold tracking-tight text-white">Reprendre</p>
                      <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mt-1">
                        Dernière conv. ouverte
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[2.5rem] flex flex-col justify-between border-dashed">
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-[#EF3C56]">Nouveautés</h3>
                    <p className="text-sm text-[#888] leading-relaxed">
                      Le social s'agrandit. Créez des <span className="font-bold">groupes</span> pour centraliser vos échanges et ne plus jamais perdre le fil de vos projets.
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-3 text-[#444]">
                      <MessageCircle size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest">v1.0.0 Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}