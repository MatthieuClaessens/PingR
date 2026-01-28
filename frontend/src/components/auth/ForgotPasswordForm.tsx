"use client";

import React, { useState } from 'react';
import { AtSign } from 'lucide-react';
import http from "../../api/http-common";

interface ForgotPasswordFormProps {
  setMode: (s: 'login' | 'register' | 'forgotpassword') => void;
}

export default function ForgotPasswordForm({ setMode }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ content: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ content: '', isError: false });
    setLoading(true);

    try {
      // Simulation ou appel réel si ton endpoint existe
      // await http.post("/auth/forgot-password", { accountEmail: email });
      
      setMessage({ 
        content: "Si cet email existe, un lien de récupération a été envoyé.", 
        isError: false 
      });
    } catch (err: any) {
      setMessage({ 
        content: "Une erreur est survenue. Veuillez réessayer.", 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-[#EEEEEE] font-bold text-2xl mt-5">Pas de panique !</h2>
      <p className="text-[#979797] max-w-[350px]">
        Donne-nous ton mail et on t'envoie un lien de récupération.
      </p>

      {/* Zone de message (Erreur ou Succès) */}
      <div className="h-12 mt-2 flex items-center justify-center">
        {message.content && (
          <p className={`text-sm font-medium px-4 ${message.isError ? 'text-[#EF3C56]' : 'text-green-400'}`}>
            {message.content}
          </p>
        )}
      </div>

      <form onSubmit={handleResetRequest} className="flex flex-col items-center mt-2 gap-4">
        <div className="relative w-[350px]">
          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#979797]" size={20} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse e-mail"
            className="text-lg py-3 pl-12 pr-4 border border-white/20 bg-transparent rounded-3xl text-[#EEEEEE] w-full outline-none focus:border-[#EF3C56] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-xl p-3 bg-[#EF3C56] rounded-3xl text-[#EEEEEE] mt-2 w-[350px] font-semibold hover:bg-[#c22f44] hover:scale-105 active:scale-95 transition duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Récupérer mon compte"}
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-3 text-sm">
        <button 
          onClick={() => setMode('login')} 
          className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition cursor-pointer bg-transparent border-none underline-offset-4 hover:underline"
        >
          Retour à la connexion
        </button>
        <button 
          onClick={() => setMode('register')} 
          className="text-[#EEEEEE] opacity-70 hover:opacity-100 transition cursor-pointer bg-transparent border-none underline-offset-4 hover:underline"
        >
          Créer un nouveau compte
        </button>
      </div>
    </div>
  );
}