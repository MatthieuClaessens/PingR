"use client";
import React, { useState, useEffect } from "react";
import { Search, MessageSquare, UserPlus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export interface Conversation {
  conversationId: number;
  userAccounts: { accountName: string }[];
}

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams(); // Pour savoir quel chat est actif

  useEffect(() => {
    fetch("http://localhost:8080/api/conversations")
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(err => console.error("Erreur Sidebar:", err));
  }, []);

  return (
    <aside className="w-[320px] flex flex-col border-r border-[#2A2A2A] bg-[#181818] h-full text-[#EEEEEE]">
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold font-['Salsa']">Ping<span className="text-[#EF3C56]">R</span></h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-[#222222] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-[#EF3C56]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <Link 
            to={`/conversation/${conv.conversationId}`}
            key={conv.conversationId}
            className={`p-4 mx-2 mb-1 rounded-xl flex items-center gap-3 transition-all ${
              Number(id) === conv.conversationId ? 'bg-[#EF3C56] text-white' : 'hover:bg-[#222222]'
            }`}
          >
            <div className="h-10 w-10 rounded-full bg-[#333333] flex-shrink-0 flex items-center justify-center font-bold">
              {conv.userAccounts[0].accountName[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-medium text-sm truncate">{conv.userAccounts[0].accountName}</h4>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}