"use client";

import React, { useState } from "react";
import { MessageCirclePlus, MessageCircle, UserPlus, EllipsisVertical, Users, History } from "lucide-react";

type ViewMode = 'contacts' | 'recent';

export default function Contacts() {
  const [view, setView] = useState<ViewMode>('contacts');

  const friends = [
    { id: 3, name: "Besique Monroe", lastSeen: "3h ago", online: true },
    { id: 7, name: "James Cavier", lastSeen: "Online", online: true },
    { id: 12, name: "Elvis Son", lastSeen: "5h ago", online: false },
  ];

  const recent = friends.slice(0, 1); 

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-oest tracking-tight">
              {view === 'contacts' ? 'Mes Amis' : 'Contacts Récents'}
            </h2>
            <span className="bg-[#2A2A2A] text-[#979797] text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
              {view === 'contacts' ? friends.length : recent.length}
            </span>
          </div>
          <p className="text-sm text-[#979797] mt-1">Gère tes contacts et tes relations PingR</p>
        </div>

        <div className="flex bg-[#181818] p-1 rounded-xl border border-[#2A2A2A]">
          <button 
            onClick={() => setView('contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'contacts' ? 'bg-[#2A2A2A] text-white' : 'text-[#979797] hover:text-white'}`}
          >
            <Users size={16} /> Amis
          </button>
          <button 
            onClick={() => setView('recent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'recent' ? 'bg-[#2A2A2A] text-white' : 'text-[#979797] hover:text-white'}`}
          >
            <History size={16} /> Récents
          </button>
        </div>
      </div>

      <div className="space-y-1 min-h-[300px]">
        {(view === 'contacts' ? friends : recent).map((friend) => (
          <div
            key={friend.id}
            className="group flex items-center justify-between p-4 rounded-xl hover:bg-[#252525] transition duration-200 border border-transparent hover:border-[#333333]"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center font-bold text-[#EF3C56] text-lg">
                  {friend.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#1E1E1E] ${friend.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              </div>

              <div className="flex flex-col">
                <h3 className="font-semibold text-[#EEEEEE] group-hover:text-white">{friend.name}</h3>
                <span className="text-xs text-[#979797]">Last seen {friend.lastSeen}</span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="p-2 text-[#979797] hover:text-[#EF3C56] hover:scale-110 transition duration-300 outline-none">
                <MessageCircle size={22} />
              </button>
              <button className="p-2 text-[#979797] hover:text-white hover:bg-[#333333] rounded-full transition duration-300 outline-none">
                <EllipsisVertical size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center border-t border-[#2A2A2A] pt-8 opacity-60 hover:opacity-100 transition duration-300">
        <button className="flex items-center gap-2 bg-[#EF3C56] px-6 py-3 rounded-xl text-white font-bold hover:bg-[#c22f44] transition shadow-lg shadow-[#EF3C56]/20 mb-6">
          <UserPlus size={18} /> Ajouter un ami
        </button>
        <div className="flex flex-col items-center">
          <MessageCirclePlus size={24} className="text-[#979797] mb-2" />
          <p className="text-sm text-[#979797]">
            Besoin de parler à quelqu'un d'autre ?
            <span className="text-[#EF3C56] ml-2 cursor-pointer hover:underline font-medium">Lancer une recherche</span>
          </p>
        </div>
      </div>
    </div>
  );
}