"use client";

import React from 'react';

export default function AuthenticationForm() {
  return (
    <main>
      <div className="z-10 bg-[#333333] rounded-xl w-[500px] py-10 text-center shadow-2xl border border-white/5">
        <h1 className="font-['Salsa'] text-5xl text-[#EEEEEE] hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h1>
        
        <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Bienvenue !</h2>
        <p className="text-[#979797]">Ravi de te revoir parmi nous !</p>

        <form className="flex flex-col items-center mt-8">
          <input 
            type="email" 
            placeholder="Insérer une adresse-mail"
            className="text-lg p-3 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] text-center w-[350px] outline-none focus:border-[#EF3C56] transition" 
          />
          <input 
            type="password" 
            placeholder="*****"
            className="text-lg p-3 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] text-center mt-4 w-[350px] outline-none focus:border-[#EF3C56] transition" 
          />
          <button 
            type="submit" 
            className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-6 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 transition duration-300 shadow-lg"
          >
            Connexion
          </button>
        </form>

        <div className="mt-6 flex flex-col items-start w-[350px] mx-auto text-sm">
          <a href="#" className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2">Mot de passe oublié ?</a>
          <a href="#" className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2">Créer un nouveau compte</a>
        </div>
      </div>
    </main>
  );
}