"use client";

import React, { useState } from 'react';

export default function AuthenticationPage() {

  return (
    <>
      <main className="flex items-center justify-center bg-[#1E1E1E] h-[100vh] w-full">
        <div className="bg-[#333333] rounded-xl w-[500px] h-[500px] text-center w-max-7xl">
          <h1 className="font-['Salsa'] text-5xl text-[#EEEEEE] mt-10">Ping<span className="text-[#EF3C56]">R</span></h1>
          <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Bienvenue !</h2>
          <p className="text-[#979797]">Ravi de te revoir parmi nous !</p>
          <form>
            <input type="email" id="email" placeholder="Insérer une adresse-mail"
              className="text-xl p-2 border border-white rounded-3xl text-[#AAAAAA] text-center mt-8 w-[350px]" />
            <input type="email" id="email" placeholder="*****"
              className="text-xl p-2 border border-white rounded-3xl text-[#AAAAAA] text-center mt-5 w-[350px]" />
            <button type="submit" className="text-xl p-2 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] text-center mt-5 w-[350px]">
              Connexion</button>
          </form>
          <div className="mt-4 text-left ml-18">
            <p className="text-[#EF3C56]">Mot de passe oublié</p>
            <p className="text-[#EEEEEE]">Créer un nouveau compte</p>
          </div>
        </div>
      </main>
    </>
  );
}