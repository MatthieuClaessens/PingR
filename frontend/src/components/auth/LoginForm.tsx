"use client";

import React from 'react';
import { useState } from 'react';
import { AtSign, LockKeyhole } from 'lucide-react';
import http from "../../api/http-common";

interface LoginFormProps {
  setMode: (s: 'login' | 'register' | 'forgotpassword') => void;
  onLoginSuccess: (data: any) => void;
}

export default function LoginForm({ setMode, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const submition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await http.post("/auth/login", {
        accountEmail: email,
        password
      });
      if (response.status === 200) {
        onLoginSuccess(response.data);
      }
    } catch (err: any) {
      setError("Email ou mot de passe incorrect.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Bienvenue !</h2>
      <p className="text-[#979797]">Ravi de te revoir parmi nous !</p>

      <form onSubmit={submition} className="flex flex-col items-center mt-8">
        <div className="relative w-[350px]">
          <AtSign
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]"
            size={20}
          />
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Insérer une adresse-mail" required
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px] mt-4">
          <LockKeyhole
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]"
            size={20}
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Insérer un mot de passe"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-6 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 transition duration-300 shadow-lg"
        >
          {loading ? "Chargement..." : "Connexion"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-start w-[350px] mx-auto text-sm">
        <a onClick={() => setMode('forgotpassword')} className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2">
          Mot de passe oublié ?
        </a>
        <a onClick={() => setMode('register')} className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2">
          Créer un nouveau compte
        </a>
      </div>
    </>
  );
}