"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, PlusCircle, MoreVertical, Phone, Video, Hash } from "lucide-react";
import http from "../../api/http-common";

export function ConversationPage({ activeId }: { activeId: number | null }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [convDetails, setConvDetails] = useState<any>(null);
  const [myId, setMyId] = useState<number | null>(null); // Pour le "Moi" dynamique
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On récupère ton ID une seule fois au chargement
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setMyId(user.id);
  }, []);

  useEffect(() => {
    if (activeId) loadConversation();
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const details = await http.get(`/conversations/${activeId}`);
      setConvDetails(details.data);
      const msgs = await http.get(`/conversations/${activeId}/messages`);
      setMessages(msgs.data.content || msgs.data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeId) return;
    try {
      const response = await http.post(`/conversations/${activeId}/messages`, { content: inputValue });
      setMessages([...messages, response.data]);
      setInputValue("");
    } catch (err) {
      console.error("Erreur d'envoi:", err);
    }
  };

  if (!activeId) return <div className="flex-1 bg-[#121212] flex items-center justify-center text-[#555555]"><Hash size={48} className="opacity-20" /></div>;

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E]">
      {/* HEADER */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818]/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#EF3C56]/10 border border-[#EF3C56]/20 flex items-center justify-center font-bold text-[#EF3C56]">
            {convDetails?.title?.charAt(0) || "C"}
          </div>
          <h3 className="text-[#EEEEEE] font-bold text-sm">{convDetails?.title || `Conversation #${activeId}`}</h3>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === myId} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* INPUT FORM */}
      <div className="p-4 bg-[#121212]">
        <form onSubmit={handleSend} className="flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#EEEEEE] px-3"
            placeholder="Écris ton message..."
          />
          <button type="submit" className="h-10 w-10 bg-[#EF3C56] text-white rounded-xl flex items-center justify-center">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}