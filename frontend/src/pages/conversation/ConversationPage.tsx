"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/globals/SideBar";
import type { Message } from "../../entities/message";
import { messageService } from "../../services/messageService";
import type { Conversation, AccountShortInfo } from "../../entities/conversation";
import http from "../../api/http-common";
import { getMyId } from "../../services/authenticationService";

import { NavBar } from "../../components/globals/NavBar";
import { MessageBubble } from "../../components/conversation/MessageBubble";
import { MessageInput } from "../../components/conversation/MessageInput";
import { ConversationHeader } from "../../components/conversation/ConversationHeader";

export default function ConversationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [myId, setMyId] = useState<number | null>(null);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentId = getMyId();
    if (currentId) {
      setMyId(Number(currentId));
    } else {
      console.error("Aucun ID utilisateur trouvé");
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    
    http.get<Conversation>(`/conversations/${id}`)
      .then(res => setSelectedConv(res.data))
      .catch(err => {
        console.error("Erreur chargement conv:", err);
        navigate("/");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!selectedConv) return;
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const data = await messageService.getMessagesByConversationId(selectedConv.conversationId);
        if (!cancelled) {
          setMessages(data.content);
        }
      } catch (err) {
        if (!cancelled) console.error("Erreur messages:", err);
      }
    };

    loadMessages();
    const interval = setInterval(() => {
      if (!document.hidden) loadMessages();
    }, 5000);

    return () => { 
      cancelled = true; 
      clearInterval(interval); 
    };
  }, [selectedConv?.conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!selectedConv) return;
    try {
      const savedMessage = await messageService.createMessage(selectedConv.conversationId, text);
      setMessages(prev => [...prev, savedMessage]);
    } catch (err) {
      alert("Erreur d'envoi");
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
      alert("Erreur modification");
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

  const handleAddUser = async (userId: number) => {
    if (!selectedConv) return;
    try {
      const response = await http.post<Conversation>(
        `/conversations/${selectedConv.conversationId}/participants/${userId}`
      );
      if (response.data.conversationId !== selectedConv.conversationId) {
        navigate(`/conversation/${response.data.conversationId}`);
      } else {
        setSelectedConv(response.data);
      }
    } catch (err) {
      alert("Action impossible");
    }
  };

  if (myId === null) {
    return <div className="h-screen bg-[#1E1E1E] flex items-center justify-center text-white">Chargement...</div>;
  }

  return (
    <div key={id} className="flex h-screen w-full bg-[#1E1E1E] overflow-hidden">
      <Sidebar myId={myId} />

      <div className="flex-1 flex flex-col h-full text-white border-l border-[#2A2A2A]">
        <NavBar onSelectConv={() => { }} />
        
        {selectedConv ? (
          <>
            <ConversationHeader 
              selectedConv={selectedConv} 
              myId={myId} 
              onConfirmAdd={handleAddUser} 
            />

            <main
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#1E1E1E]"
            >
              {messages.map((msg) => {
                const isMe = Number(msg.userAccount?.accountId) === Number(myId);
                
                return (
                  <MessageBubble
                    key={msg.messageId}
                    msg={msg}
                    isMe={isMe}
                    isGroup={selectedConv.conversationType === 'GROUP'}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </main>

            <MessageInput
              onSendMessage={handleSendMessage}
              placeholderName={
                selectedConv.conversationType === 'SINGLE' 
                ? (selectedConv.participants?.find((p: AccountShortInfo) => p.accountId !== myId)?.accountName || "Discussion")
                : "Message de groupe"
              }
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic font-medium">
            Sélectionne une discussion pour commencer à pinger.
          </div>
        )}
      </div>
    </div>
  );
}