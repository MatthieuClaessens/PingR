"use client";

import React from 'react';
import bgPattern from '../../assets/images/svg/background.svg';
import Wave from '../../assets/images/svg/wave.svg';
import AuthenticationForm from '../../components/auth/AuthenticationForm';

export default function AuthenticationPage() {
  return (
    <main
      className="relative flex items-center justify-center min-h-screen w-full bg-[#1E1E1E] overflow-hidden"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 80px'
      }}
    >
      <div className="absolute top-8 left-10 z-20">
        <h3 className="font-['Salsa'] text-5xl text-[#EEEEEE] hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>
      <div className="z-10 relative">
        <AuthenticationForm />
      </div>
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        <img
          src={Wave}
          alt="Arrière-plan: Vague / Wave"
          className="w-full h-auto min-h-[100px] object-cover"
        />
      </div>
    </main>
  );
}