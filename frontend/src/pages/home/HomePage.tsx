"use client";

import React from "react";
import { Navbar } from "../../components/globals/NavBar";
import Contacts from "../../components/home/Contacts";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-[#1E1E1E] text-[#EEEEEE]">
      <Navbar />

      <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <Contacts/>
      </div>
    </main>
  );
}