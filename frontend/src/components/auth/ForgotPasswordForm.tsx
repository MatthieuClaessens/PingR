"use client";

import React from 'react';
import { useState } from 'react';
import { AtSign, LockKeyhole, UserRound } from 'lucide-react';

export default function ForgotPasswordForm({setMode}: any) {
  return (
    <>
<h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Pas de panique !</h2>
            <p className="text-[#979797]">Donne-nous ton mail et on t'envoie un lien de récupération.</p>

            <form className="flex flex-col items-center mt-8">
              
              <div className="relative w-[350px]">
                <AtSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Insérer une adresse-mail"
                  className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
                />
                </div>
              <button
                type="submit"
                className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-6 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 transition duration-300 shadow-lg"
              >
                Récupérer mon compte
              </button>
            </form>

            <div className="mt-6 flex flex-col items-start w-[350px] mx-auto text-sm">
              <a onClick={() => setMode('login')} className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2">
                Se connecter
              </a>
              <a onClick={() => setMode('register')} className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2">
                Créer un nouveau compte
              </a>
            </div>
            </>
  );
}