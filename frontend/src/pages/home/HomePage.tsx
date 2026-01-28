"use client";

import React from "react";
import { MessageCirclePlus } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex items-center justify-center h-[96vh] w-full bg-[#1E1E1E] overflow-hidden">
      <div className="flex flex-col items-center text-center max-w-md px-6">
        <MessageCirclePlus size={56} className="text-[#EF3C56]" />

        <h1 className="mt-6 text-2xl font-semibold text-[#EEEEEE]">
          Bienvenue sur PingR
        </h1>

        <p className="mt-3 text-sm text-[#979797]">
          Sélectionne une conversation existante ou crée-en une nouvelle pour commencer à discuter.
        </p>

        <button
          className="mt-8 px-6 py-3 rounded-full bg-[#EF3C56] text-[#EEEEEE] font-semibold hover:bg-[#c22f44] transition"
        >
          Nouvelle conversation
        </button>
      </div>
    </main>
  );
}
