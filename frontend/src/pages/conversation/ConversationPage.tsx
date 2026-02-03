"use client";
import React from "react";
import { Send, Hash, MoreVertical, Phone, Video, Search } from "lucide-react";

export default function ConversationPage() {
  const hasActiveChat = true;

  const discussions = [
    { id: 1, name: "Nenfal", lastMsg: "Salut.", time: "10:45", active: true },
    { id: 2, name: "Léonard", lastMsg: "On automatise ça ?", time: "Hier", active: false },
    { id: 3, name: "Julie", lastMsg: "Le projet pro avance ?", time: "Lun.", active: false },
  ];

  interface UserAccount {
    accountId: number;
    accountName: string;
    avatarPath: string;
  }

  interface Conversation {
    conversationId: number;
    conversationType: string;
    userAccounts: UserAccount[];
  }

  if (!hasActiveChat) {
    return (
      <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center text-[#555555]">
        <Hash size={64} className="opacity-10 mb-4" />
        <p className="text-sm tracking-widest uppercase opacity-30">Sélectionnez une discussion</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[320px_1fr] h-screen w-full bg-[#121212] text-[#EEEEEE] overflow-hidden">
      
      <aside className="flex flex-col border-r border-[#2A2A2A] bg-[#181818]">
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#2A2A2A]">
          <h2 className="text-2xl font-bold font-['Salsa']">Ping<span className="text-[#EF3C56]">R</span></h2>
          <Search size={20} className="text-[#555555] cursor-pointer hover:text-[#EEEEEE]" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {discussions.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${chat.active ? 'bg-[#2A2A2A] border-l-4 border-[#EF3C56]' : 'hover:bg-[#222222]'}`}
            >
              <div className="h-12 w-12 rounded-full bg-[#333333] flex items-center justify-center font-bold text-[#EF3C56]">
                {chat.name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium truncate">{chat.name}</h4>
                  <span className="text-[10px] text-[#555555]">{chat.time}</span>
                </div>
                <p className="text-xs text-[#555555] truncate">{chat.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-col bg-[#1E1E1E] overflow-hidden">
        
        <header className="h-20 px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#EF3C56] to-[#ff7e91] flex items-center justify-center font-bold">
                N
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#181818]"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Nenfal</h3>
              <span className="text-xs text-green-500">En ligne</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#555555]">
            <Phone size={20} className="hover:text-[#EF3C56] cursor-pointer transition-colors" />
            <Video size={20} className="hover:text-[#EF3C56] cursor-pointer transition-colors" />
            <MoreVertical size={20} className="hover:text-[#EF3C56] cursor-pointer transition-colors" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-[#2A2A2A] p-4 rounded-2xl rounded-tl-none shadow-lg">
              <p className="text-sm text-gray-200">Salut !</p>
              <span className="text-[10px] text-[#555555] mt-2 block text-right">10:42</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[70%] bg-[#EF3C56] p-4 rounded-2xl rounded-tr-none shadow-lg text-white">
              <p className="text-sm font-medium">Salut.</p>
              <span className="text-[10px] text-white/60 mt-2 block text-right">10:45</span>
            </div>
          </div>
        </main>

        <footer className="p-6 bg-[#121212]">
          <div className="max-w-4xl mx-auto flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2 focus-within:border-[#EF3C56]/50 transition-all shadow-2xl">
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-[#EEEEEE] px-4 py-2"
              placeholder="Écris ton message ici..."
            />
            <button className="h-11 w-11 bg-[#EF3C56] hover:bg-[#d6354d] text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95">
              <Send size={20} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}