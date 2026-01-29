"use client";

import React, { useState } from "react";
import { Bell, Settings, User, Search, LogOut, UserCircle, ShieldCheck } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="h-14 w-full bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between px-4 relative z-[100]">
      <div className="flex items-center gap-3">
        <h3 className="font-['Salsa'] text-4xl text-[#EEEEEE] cursor-pointer hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-[#979797]" size={16} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-[#121212] text-sm text-[#EEEEEE] pl-10 pr-4 py-1.5 rounded-md border border-[#2A2A2A] focus:border-[#EF3C56] outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        <Settings className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        
        <div className="h-8 w-px bg-[#2A2A2A] mx-1" />
        
        {/* BOUTON PROFIL AVEC DROPDOWN */}
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

          {/* MENU DÉROULANT DU COMPTE */}
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
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF3C56] hover:bg-[#EF3C56]/10 rounded-lg transition">
                    <LogOut size={16} /> Déconnexion
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