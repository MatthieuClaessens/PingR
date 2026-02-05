"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Phone, Video, MoreVertical, MoreHorizontal, Edit2, Trash2, Check, X } from "lucide-react";
import { Sidebar } from "../../components/globals/Sidebar";
import type { Message } from "../../entities/message";
import { messageService } from "../../services/messageService";
import type { Conversation } from "../../entities/conversation";
import http from "../../api/http-common";
import { getMyId } from "../../services/authenticationService";

export default function ConversationPage() {
  const myId = getMyId();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  if (!myId) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-[#1E1E1E]">
        <p>Session expirée. Reconnecte-toi.</p>
      </div>
    );
  }

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
        if (!cancelled) {
          setMessages(data.content);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Erreur de chargement", err);
        }
      }
    };

    loadMessages();

    const interval = setInterval(() => {
      if (!document.hidden) {
        loadMessages();
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedConv?.conversationId]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedConv) return;

    try {
      const savedMessage = await messageService.createMessage(selectedConv.conversationId, inputText);
      setMessages(prev => [...prev, savedMessage]);
      setInputText("");
    } catch (err) {
      console.error("Erreur envoi:", err);
      alert("Impossible d'envoyer le message");
    }
  };

  const startEdit = (msg: Message) => {
    setEditingMessageId(msg.messageId);
    setEditText(msg.messageContent);
    setMenuOpenId(null);
  };

  const saveEdit = async (messageId: number) => {
    if (!editText.trim() || !selectedConv) return;

    try {
      await messageService.editMessage(selectedConv.conversationId, messageId, editText);
      setMessages(prev => prev.map(m =>
        m.messageId === messageId
          ? { ...m, messageContent: editText }
          : m
      ));
      setEditingMessageId(null);
      setEditText("");
    } catch (err) {
      console.error("Erreur édition:", err);
      alert("Impossible de modifier le message");
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const deleteMessage = async (messageId: number) => {
    if (!selectedConv || !confirm("Supprimer ce message ?")) return;

    try {
      await messageService.deleteMessage(selectedConv.conversationId, messageId);
      setMessages(prev => prev.filter(m => m.messageId !== messageId));
      setMenuOpenId(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Impossible de supprimer le message");
    }
  };

  const contact = selectedConv?.participants?.find(c => c.accountId !== myId);
  const displayName = contact ? contact.accountName : "Discussion";

  return (
    <div className="flex h-screen w-full bg-[#1E1E1E] overflow-hidden">
      <Sidebar myId={myId} />

      <div className="flex-1 flex flex-col h-full text-white border-l border-[#2A2A2A]">
        {selectedConv ? (
          <>
            <header className="h-20 px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818]">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#EF3C56] flex items-center justify-center font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{displayName}</h3>
                  <span className="text-xs text-green-500">En ligne</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-500">
                <Phone size={20} className="cursor-pointer hover:text-white" />
                <Video size={20} className="cursor-pointer hover:text-white" />
                <MoreVertical size={20} className="cursor-pointer hover:text-white" />
              </div>
            </header>

            <main
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#1E1E1E]"
            >
              {messages.map((msg) => {
                const authorId = msg.userAccount?.accountId;
                const isMe = authorId === myId;
                const isEditing = editingMessageId === msg.messageId;

                return (
                  <div
                    key={msg.messageId}
                    className={`max-w-[70%] ${isMe ? 'self-end' : 'self-start'} group`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-sm shadow-md relative
                      ${isMe
                          ? "bg-[#EF3C56] rounded-br-none"
                          : "bg-[#2A2A2A] rounded-bl-none border border-[#333]"
                        }`}
                    >
                      {isMe && !isEditing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === msg.messageId ? null : msg.messageId);
                          }}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-[#2A2A2A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#333]"
                        >
                          <MoreHorizontal size={14} className="text-white" />
                        </button>
                      )}

                      {menuOpenId === msg.messageId && (
                        <div className="absolute top-6 right-0 bg-[#2A2A2A] rounded-lg shadow-lg border border-[#333] py-1 z-10 min-w-[120px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(msg);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-[#333] flex items-center gap-2 text-white"
                          >
                            <Edit2 size={12} />
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(msg.messageId);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-[#333] flex items-center gap-2 text-red-400"
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      )}

                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-[#1E1E1E] text-white p-2 rounded text-sm outline-none resize-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => saveEdit(msg.messageId)}
                              className="h-6 w-6 bg-green-600 rounded flex items-center justify-center hover:bg-green-700"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="h-6 w-6 bg-red-600 rounded flex items-center justify-center hover:bg-red-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{msg.messageContent}</p>
                          <span className="text-[10px] block mt-1 text-right opacity-40">
                            {new Date(msg.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </main>

            <footer className="p-6 bg-[#121212] border-t border-[#2A2A2A]">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="max-w-4xl mx-auto flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2 focus-within:border-[#EF3C56] transition-colors"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Écris à ${displayName}...`}
                  className="flex-1 bg-transparent outline-none px-4 py-2 text-white placeholder:text-gray-600"
                />
                <button type="submit" className="h-10 w-10 bg-[#EF3C56] rounded-xl flex items-center justify-center hover:bg-[#d6354d] transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </footer>
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
