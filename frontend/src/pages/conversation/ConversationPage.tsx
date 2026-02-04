import React, { useState, useEffect } from "react";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import Sidebar from "../../components/globals/SideBar";
import { messageService } from "../../services/message/MessageService";
import type { Message } from "../../entities/Message";

export default function ConversationPage() {
  const myId = 1;
  const conversationId = 8;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await messageService.getMessagesByConversationId(conversationId);
        setMessages(data.content);
      } catch (err) {
        console.error("Erreur de chargement", err);
      }
    };
    loadMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const savedMessage = await messageService.createMessage(conversationId, inputText);
      setMessages([...messages, savedMessage]);
      setInputText("");
    } catch (err) {
      alert("Impossible d'envoyer le message");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1E1E1E] overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col h-full text-white border-l border-[#2A2A2A]">

        <header className="h-20 px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818]">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#EF3C56] flex items-center justify-center font-bold">J</div>
            <div>
              <h3 className="font-bold text-lg">Jean Dev</h3>
              <span className="text-xs text-green-500">En ligne</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-500">
            <Phone size={20} className="cursor-pointer hover:text-white" />
            <Video size={20} className="cursor-pointer hover:text-white" />
            <MoreVertical size={20} className="cursor-pointer hover:text-white" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#1E1E1E]">
          {messages.map((msg) => {
            const authorId = msg.userAccount?.accountId;

            return (
              <div key={msg.messageId} className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-md 
                ${authorId === myId ? "bg-[#EF3C56] self-end rounded-br-none"
                    : "bg-[#2A2A2A] self-start rounded-bl-none border border-[#333]"
                  }`}>
                <p>{msg.messageContent}</p>
                <span className="text-[10px] block mt-1 text-right opacity-40">
                  {new Date(msg.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </main>

        <footer className="p-6 bg-[#121212] border-t border-[#2A2A2A]">
          <div className="max-w-4xl mx-auto flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2 focus-within:border-[#EF3C56] transition-colors">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
              placeholder="Écris un truc..." className="flex-1 bg-transparent outline-none px-4 py-2
              text-white placeholder:text-gray-600"
            />
            <button type="submit" className="h-10 w-10 bg-[#EF3C56] rounded-xl flex items-center 
            justify-center hover:bg-[#d6354d] transition-colors">
              <Send size={18} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}