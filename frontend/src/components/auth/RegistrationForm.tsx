"use client";

import React, { useState } from 'react';
import { AtSign, LockKeyhole, UserRound } from 'lucide-react';
import http from "../../api/http-common";

interface RegistrationProps {
  setMode: (s: 'login' | 'register' | 'forgotpassword') => void;
}

export default function RegistrationForm({ setMode }: RegistrationProps) {
  const [formData, setFormData] = useState({
    email: '',
    accountName: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 10) {
      setError("Le mot de passe doit contenir au moins 10 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await http.post("/auth/register", {
        accountEmail: formData.email,
        accountName: formData.accountName,
        password: formData.password,
      });

      setMode('login');
      
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || err.response?.data?.password;
      
      if (backendMessage) {
        setError(backendMessage);
      } else if (err.response?.status === 400) {
        setError("Données invalides. Veuillez vérifier vos informations.");
      } else {
        setError("L'adresse email ou le nom d'utilisateur est déjà pris.");
      }
      
      console.error("Détails de l'erreur:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Inscription</h2>
      <p className="text-[#979797] mb-2">Rejoins l'aventure PingR dès maintenant !</p>

      <div className="h-6 mt-2">
        {error && <p className="text-[#EF3C56] text-sm font-medium animate-pulse">{error}</p>}
      </div>

      <form onSubmit={handleRegistration} className="flex flex-col items-center mt-4 gap-4">
        <div className="relative w-[350px]">
          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            name="email" type="email" required
            value={formData.email} onChange={handleChange}
            placeholder="Adresse e-mail"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px]">
          <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            name="accountName" type="text" required
            value={formData.accountName} onChange={handleChange}
            placeholder="Nom d'utilisateur"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px]">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            name="password" type="password" required
            value={formData.password} onChange={handleChange}
            placeholder="Mot de passe (10+ car.)"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px]">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            name="confirmPassword" type="password" required
            value={formData.confirmPassword} onChange={handleChange}
            placeholder="Confirmer le mot de passe"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-4 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 active:scale-95 transition duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Création du compte..." : "Inscription"}
        </button>
      </form>

      <div className="mt-6 w-[350px] text-center">
        <button 
          onClick={() => setMode('login')} 
          className="text-[#EEEEEE] opacity-70 hover:opacity-100 hover:text-[#EF3C56] transition text-sm underline underline-offset-4"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}