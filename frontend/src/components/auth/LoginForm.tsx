"use client";

import React, { useState } from 'react';
import { AtSign, LockKeyhole } from 'lucide-react';
import http from "../../api/http-common";
import { setToken } from "../../services/auth/AuthenticationService";

interface LoginFormProps {
  setMode: (s: 'login' | 'register' | 'forgotpassword') => void;
  onLoginSuccess: (data: any) => void;
}

export default function LoginForm({ setMode, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await http.post("/auth/login", {
        accountEmail: email,
        password: password
      });

      if (response.status === 200) {
        setToken(response.data.token);
        onLoginSuccess(response.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Erreur de connexion. Veuillez réessayer plus tard.");
      }
      console.error("Login error details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Bienvenue !</h2>
      <p className="text-[#979797]">Ravi de te revoir parmi nous !</p>

      <div className="h-6 mt-2">
        {error && (
          <p className="text-[#EF3C56] text-sm font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={handleLogin} className="flex flex-col items-center mt-4 gap-4">
        <div className="relative w-[350px]">
          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse e-mail" 
            required
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px]">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Mot de passe" 
            required
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <button
          type="submit" 
          disabled={loading}
          className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-4 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 active:scale-95 transition duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <button 
          onClick={() => setMode('forgotpassword')} 
          className="text-[#979797] hover:text-[#EEEEEE] transition cursor-pointer bg-transparent border-none"
        >
          Mot de passe oublié ?
        </button>
        <button 
          onClick={() => setMode('register')} 
          className="text-[#EEEEEE] opacity-70 hover:opacity-100 hover:text-[#EF3C56] transition underline underline-offset-4 cursor-pointer bg-transparent border-none"
        >
          Créer un nouveau compte
        </button>
      </div>
    </div>
  );
}