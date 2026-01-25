"use client";

import React from 'react';
import bgPattern from '../../assets/images/svg/background.svg';
import Wave from '../../assets/images/svg/wave.svg';
import { AtSign, LockKeyhole } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm"
import RegistrationForm from "../../components/auth/RegistrationForm"
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { useState } from 'react';

const validateEmail = (email: string) => email.includes('@') && email.length > 5;
const validatePassword = (pass: string) => pass.length >= 10;


export default function AuthenticationPage() {
  const [mode, setMode] = useState('login');
  return (
    <main
      className="relative flex items-center justify-center min-h-screen w-full bg-[#1E1E1E] overflow-hidden"
    >
      <div className="absolute top-8 left-10 z-20">
        <h3 className="font-['Salsa'] text-5xl text-[#EEEEEE] hover:scale-105 transition duration-300">
          Ping<span className="text-[#EF3C56]">R</span>
        </h3>
      </div>
      <div className="z-10 relative">
        <div className="z-10 bg-[#333333] rounded-xl w-[500px] py-10 text-center shadow-2xl border border-white/5">
          <h1 className="font-['Salsa'] text-5xl text-[#EEEEEE] hover:scale-105 transition duration-300 cursor-default">
            Ping<span className="text-[#EF3C56]">R</span>
          </h1>
          <div>
            {(() => {
              switch (mode) {
                case 'login':
                  return <LoginForm setMode={setMode} 
                  checkEmail={validateEmail} checkPass={validatePassword}
                  onAuthSuccess={handleAuthSuccess}/>
                case 'register':
                  return <RegistrationForm setMode={setMode} />;
                case 'forgotpassword':
                  return <ForgotPasswordForm setMode={setMode} />;
                default:
                  return <LoginForm setMode={setMode} />;
              }
            })()}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        <img
          src={Wave}
          alt="Arrière-plan: Vague / Wave"
          className="w-full h-auto min-h-[100px] object-cover"
        />
      </div>
      <footer className="absolute bottom-4 left-0 w-full z-20">
        <p className="flex items-center justify-center flex-wrap gap-4 text-white opacity-60 text-[12px] tracking-widest uppercase text-center">
          <span>© 2026 PingR</span>
          <span className="opacity-50">—</span>
          <a href="#" className="hover:text-black transition">
            Mentions légales
          </a>
          <span className="opacity-50">—</span>
          <a
            href="https://matthieuclaessens.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            By Matthieu CLAESSENS
          </a>
        </p>
      </footer>
    </main>
  );
}