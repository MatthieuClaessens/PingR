"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Hash } from "lucide-react";
import http from "../../api/http-common";
import MessageBubble from "../../components/conversation/MessageBubble";

interface Props {
  activeId: number | null;
}

export function ConversationPage({ activeId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [convDetails, setConvDetails] = useState<Conversation | null>(null);
  const [myId, setMyId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setMyId(user.accountId || user.id);
    }
  }, []);

  useEffect(() => {
    if (activeId) {
      loadConversation();
    }
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const [detailsRes, messagesRes] = await Promise.all([
        http.get<Conversation>(`/conversations/${activeId}`),
        http.get<any>(`/conversations/${activeId}/messages`)
      ]);

      setConvDetails(detailsRes.data);

      const rawData = messagesRes.data;
      setMessages(Array.isArray(rawData) ? rawData : rawData.content || []);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeId) return;

    try {
      const { data } = await http.post<Message>(`/conversations/${activeId}/messages`, {
        content: inputValue
      });
      setMessages(prev => [...prev, data]);
      setInputValue("");
    } catch (err) {
      console.error("Erreur d'envoi:", err);
    }
  };

  if (!activeId) {
    return (
      <div className="flex-1 bg-[#121212] flex items-center justify-center text-[#555555]">
        <Hash size={48} className="opacity-20" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#1E1E1E]">
      <div className="h-20 px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818]/50">

        <div className="flex-shrink-0">
          <h3
            onClick={() => navigate('/home')}
            className="font-['Salsa'] text-4xl text-[#EEEEEE] cursor-pointer hover:scale-105 transition duration-300"
          >
            Ping<span className="text-[#EF3C56]">R</span>
          </h3>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-3 bg-[#222222] px-4 py-2 rounded-full border border-[#333333]">
            <div className="h-2 w-2 rounded-full bg-[#EF3C56] animate-pulse" />

            <h3 className="text-[#EEEEEE] font-bold text-sm tracking-wide">
              {convDetails?.conversationType === 'SINGLE'
                ? convDetails.participants?.find(p => p.accountId !== myId)?.accountName
                : convDetails?.title || "Discussion de groupe"}
            </h3>
          </div>
        </div>

        <div className="flex-shrink-0 w-[120px] flex justify-end">
        </div>
      </div>

<div className="flex-1 overflow-y-auto py-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.content}
          isMe={msg.senderId === myId} 
          timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />
      ))}
    </div>

      <div className="p-4 bg-[#121212]">
        <form onSubmit={handleSend} className="flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2 focus-within:border-[#EF3C56]/50 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#EEEEEE] px-3 py-2"
            placeholder="Écris ton message..."
          />
          <button type="submit" className="h-10 w-10 bg-[#EF3C56] hover:bg-[#d6354d] text-white rounded-xl flex items-center justify-center transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}