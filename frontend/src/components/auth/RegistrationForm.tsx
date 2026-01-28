"use client";

import React, { useState } from 'react'; // Ajout de useState ici
import { AtSign, LockKeyhole, UserRound } from 'lucide-react';
import http from "../../api/http-common"; // On importe ton client axios

interface RegistrationProps {
  setMode: (s: 'login' | 'register' | 'forgotpassword') => void;
}

export default function RegistrationForm({ setMode }: RegistrationProps) {
  const [email, setEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await http.post("/auth/register", {
        accountEmail: email,
        accountName: accountName,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        setMode('login'); 
      }
    } catch (err: any) {
      setError("Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Inscription</h2>
      <p className="text-[#979797]">Rejoins l'aventure PingR dès maintenant !</p>

      {error && <p className="text-[#EF3C56] mt-4 text-sm">{error}</p>}

      <form onSubmit={submition} className="flex flex-col items-center mt-8">
        <div className="relative w-[350px]">
          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Insérer une adresse-mail"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px] mt-4">
          <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="text" required
            value={accountName} onChange={(e) => setAccountName(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px] mt-4">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Créer un mot de passe"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <div className="relative w-[350px] mt-4">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="password" required
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre mot de passe"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <button
          type="submit" disabled={loading} value={submition}
          className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-6 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 transition duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Inscription"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-start w-[350px] mx-auto text-sm">
        <button onClick={() => setMode('login')} className="cursor-pointer text-[#EEEEEE] opacity-70 hover:opacity-100 transition mt-2 bg-transparent border-none">
          Se connecter
        </button>
      </div>
    </>
  );
}