"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentId = getMyId();
    if (currentId) {
      setMyId(Number(currentId));
    }
  }, []);

  useEffect(() => {
    http.get("/conversations/all")
      .then(res => {
        const data = res.data.content || res.data;
        setConversations(data);
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    
    http.get(`/conversations/${id}`)
      .then(res => {
        const conv = (res.data as any).content 
          ? (res.data as any).content[0] 
          : res.data;
        setSelectedConv(conv as Conversation);
      })
      .catch(err => {
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
        if (!cancelled) {}
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
    } catch (err) {}
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!selectedConv || !confirm("Supprimer ce message ?")) return;
    try {
      await messageService.deleteMessage(selectedConv.conversationId, messageId);
      setMessages(prev => prev.filter(m => m.messageId !== messageId));
    } catch (err) {}
  };

  const handleAddUser = async (userId: number) => {
    if (!selectedConv) return;
    try {
      const url = `/conversations/${selectedConv.conversationId}/participants/${userId}`;
      const response = await http.post<Conversation>(url);
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
    return (
      <div className="h-screen bg-[#1E1E1E] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF3C56] mb-4"></div>
        <p>Initialisation du profil...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#1E1E1E] overflow-hidden relative">
      <Sidebar myId={myId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} conversations={conversations} />

      <div className="flex-1 flex flex-col h-full text-white border-l border-[#2A2A2A]">
        <NavBar 
          onSelectConv={() => {}} 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={true}
        />
        
        {selectedConv ? (
          <>
            <ConversationHeader 
              selectedConv={selectedConv} 
              myId={myId} 
              onConfirmAdd={handleAddUser} 
            />

            <main
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-[#1E1E1E]"
            >
              {messages.map((msg) => {
                const isMe = Number(msg.userAccount?.accountId) === Number(myId);
                return (
                  <MessageBubble
                    key={msg.messageId}
                    msg={msg}
                    isMe={isMe}
                    isGroup={selectedConv.conversationType === "GROUP"}
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
                selectedConv.conversationType === "SINGLE"
                  ? (selectedConv.participants?.find((p: AccountShortInfo) => p.accountId !== myId)?.accountName || "Discussion")
                  : "Message de groupe"
              }
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic font-medium">
            <div className="text-center">
              <p>Aucune discussion sélectionnée.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
