import React from "react";
import { Bell, Settings, User, Search } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="h-14 w-full bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h3 className="font-['Salsa'] text-4xl text-[#EEEEEE] hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-[#979797]" size={16} />
          <input
            type="text"
            placeholder="Rechercher ou lancer une conversation"
            className="w-full bg-[#121212] text-sm text-[#EEEEEE] pl-10 pr-4 py-1.5 rounded-md border border-transparent focus:border-[#EF3C56] outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        <Settings className="text-[#979797] hover:text-[#EEEEEE] cursor-pointer transition" size={20} />
        
        <div className="h-8 w-px bg-[#2A2A2A] mx-1" />
        
        <div className="flex items-center gap-2 pl-2 cursor-pointer group">
          <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center border border-[#3A3A3A] group-hover:border-[#EF3C56] transition">
            <User size={18} className="text-[#979797] group-hover:text-[#EF3C56]" />
          </div>
          <span className="text-sm font-medium text-[#979797] group-hover:text-[#EEEEEE] hidden sm:block">
            Mon Profil
          </span>
        </div>
      </div>
    </nav>
  );
};