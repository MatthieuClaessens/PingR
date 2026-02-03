"use client";
import React from "react";
import { MessageSquare, Settings, LogOut, Search } from "lucide-react";

export function Sidebar({ onSelectChat, activeId }: { onSelectChat: (id: number) => void, activeId: number | null }) {
  const chats = [
    { id: 1, name: "Nenfal", lastMsg: "Salut !", time: "10:45" },
    { id: 2, name: "Test", lastMsg: "Ça marche ?", time: "Hier" },
  ];

  return (
    <aside className="w-80 h-screen bg-[#181818] border-r border-[#2A2A2A] flex flex-col">
      <div className="p-6 border-b border-[#2A2A2A]">
        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#555555]" size={18} />
          <input 
            className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl py-2 pl-10 pr-4 text-sm focus:border-[#EF3C56] outline-none" 
            placeholder="Rechercher..." 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-[#222222] ${activeId === chat.id ? 'bg-[#222222] border-l-4 border-[#EF3C56]' : ''}`}
          >
            <div className="h-12 w-12 rounded-full bg-[#2A2A2A] flex-shrink-0 flex items-center justify-center font-bold text-[#EF3C56]">
              {chat.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-white truncate">{chat.name}</p>
                <span className="text-[10px] text-[#555555]">{chat.time}</span>
              </div>
              <p className="text-xs text-[#555555] truncate">{chat.lastMsg}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#2A2A2A] flex justify-between text-[#555555]">
        <Settings size={20} className="hover:text-white cursor-pointer" />
        <LogOut size={20} className="hover:text-[#EF3C56] cursor-pointer" />
      </div>
    </aside>
  );
}