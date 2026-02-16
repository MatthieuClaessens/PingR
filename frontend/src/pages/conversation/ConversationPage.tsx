"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/globals/SideBar";
import type { Message } from "../../entities/message";
import { messageService } from "../../services/messageService";
import type { Conversation } from "../../entities/conversation";
import http from "../../api/http-common";
import { getMyId } from "../../services/authenticationService";

import { NavBar } from "../../components/globals/NavBar";
import { MessageBubble } from "../../components/conversation/MessageBubble";
import { MessageInput } from "../../components/conversation/MessageInput";
import { ConversationHeader } from "../../components/conversation/ConversationHeader";

export default function ConversationPage() {
  const myId = getMyId();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!id) return;
    http.get(`/conversations/${id}`)
      .then(res => setSelectedConv(res.data))
      .catch(err => console.error("Erreur chargement conversation:", err));
  }, [id]);

  useEffect(() => {
    if (!selectedConv) return;
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const data = await messageService.getMessagesByConversationId(selectedConv.conversationId);
        if (!cancelled) setMessages(data.content);
      } catch (err) {
        if (!cancelled) console.error("Erreur de chargement", err);
      }
    };

    loadMessages();
    const interval = setInterval(() => {
      if (!document.hidden) loadMessages();
    }, 5000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [selectedConv?.conversationId]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const handleSendMessage = async (text: string) => {
    if (!selectedConv) return;
    try {
      const savedMessage = await messageService.createMessage(selectedConv.conversationId, text);
      setMessages(prev => [...prev, savedMessage]);
    } catch (err) {
      alert("Impossible d'envoyer le message");
    }
  };

  const handleEditMessage = async (messageId: number, newText: string) => {
    if (!selectedConv) return;
    try {
      await messageService.editMessage(selectedConv.conversationId, messageId, newText);
      setMessages(prev => prev.map(m =>
        m.messageId === messageId ? { ...m, messageContent: newText } : m
      ));
    } catch (err) {
      alert("Impossible de modifier");
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!selectedConv || !confirm("Supprimer ce message ?")) return;
    try {
      await messageService.deleteMessage(selectedConv.conversationId, messageId);
      setMessages(prev => prev.filter(m => m.messageId !== messageId));
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  if (!myId) return <div className="flex h-screen items-center justify-center text-white bg-[#1E1E1E]">Session expirée.</div>;

  return (
    <div className="flex h-screen w-full bg-[#1E1E1E] overflow-hidden">
      <Sidebar myId={myId} />

      <div className="flex-1 flex flex-col h-full text-white border-l border-[#2A2A2A]">
        <NavBar onSelectConv={() => { }} />
        {selectedConv ? (
          <>
            <ConversationHeader selectedConv={selectedConv} myId={myId} />

            <main
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#1E1E1E]"
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.messageId}
                  msg={msg}
                  isMe={msg.userAccount?.accountId === myId}
                  isGroup={selectedConv.conversationType === 'GROUP'}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </main>

            <MessageInput
              onSendMessage={handleSendMessage}
              placeholderName={selectedConv.participants?.find(p => p.accountId !== myId)?.accountName || "Discussion"}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic">
            Sélectionne une discussion pour commencer à pinger.
          </div>
        )}
      </div>
    </div>
  );
}