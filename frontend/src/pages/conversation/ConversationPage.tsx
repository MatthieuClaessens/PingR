import React, { useState } from "react";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import Sidebar from "../../components/globals/SideBar";


export interface UserAccount {
  accountId: number;
  accountName: string;
  avatarPath: string;
}

export interface Conversation {
  conversationId: number;
  conversationType: 'private' | 'group';
  messages: Message[];
  creatorId?: number;
}

export interface Message {
  messageId: number;
  messageDate: string;
  messageContent: string;
  accountId: number;
  conversationId: number;
}

export default function ConversationPage() {
  const myId = 1;

  const [messages, setMessages] = useState<Message[]>([
    { messageId: 1, messageDate: "2026-02-03T10:00:00", messageContent: "Test1", accountId: 2, conversationId: 8 },
    { messageId: 2, messageDate: "2026-02-03T10:02:00", messageContent: "Test2", accountId: 1, conversationId: 8 },
    { messageId: 3, messageDate: "2027-02-03T10:02:00", messageContent: "Test3", accountId: 1, conversationId: 8 }    
  ]);

  const [inputText, setInputText] = useState("");

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
          {messages.map((msg) => (
            <div 
              key={msg.messageId} 
              className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-md ${
                msg.accountId === myId 
                  ? "bg-[#EF3C56] self-end rounded-br-none" 
                  : "bg-[#2A2A2A] self-start rounded-bl-none border border-[#333]"
              }`}
            >
              <p>{msg.messageContent}</p>
              <span className={`text-[10px] block mt-1 text-right ${
                msg.accountId === myId ? "text-white/50" : "opacity-40"
              }`}>
                {msg.messageDate.split('T')[1].substring(0, 5)}
              </span>
            </div>
          ))}
        </main>

        <footer className="p-6 bg-[#121212] border-t border-[#2A2A2A]">
          <div className="max-w-4xl mx-auto flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2 focus-within:border-[#EF3C56] transition-colors">
            <input
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écris un truc..."
              className="flex-1 bg-transparent outline-none px-4 py-2 text-white placeholder:text-gray-600"
            />
            <button className="h-10 w-10 bg-[#EF3C56] rounded-xl flex items-center justify-center hover:bg-[#d6354d] transition-colors">
              <Send size={18} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}