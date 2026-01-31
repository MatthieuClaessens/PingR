import React, { useState } from "react";
import { Send, Users, MessageSquare, Hash, Search, PlusCircle } from "lucide-react";

export const ConversationPage = () => {

  const [view, setView] = useState('chats')
  const [selectedChat, setSelectedChat] = useState("besique_monroe");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#313338] text-[#DBDEE1]">
      
      <aside className="w-72 bg-[#2B2D31] flex flex-col hidden md:flex">
        
        <div className="h-12 border-b border-[#1F2124] flex items-center px-4 gap-2">
           <button 
            onClick={() => setView('chats')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition ${view === 'chats' ? 'bg-[#404249] text-white' : 'hover:bg-[#35373C] text-[#949BA4]'}`}
           >
             <MessageSquare size={16} /> Messages
           </button>
           <button 
            onClick={() => setView('friends')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition ${view === 'friends' ? 'bg-[#404249] text-white' : 'hover:bg-[#35373C] text-[#949BA4]'}`}
           >
             <Users size={16} /> Amis
           </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 px-2">
          {view === 'chats' ? (
            <>
              <p className="px-2 pt-4 pb-2 text-[11px] font-bold uppercase text-[#949BA4]">Messages Directs</p>
              <ChatItem name="Besique Monroe" active={selectedChat === "besique_monroe"} onClick={() => setSelectedChat("besique_monroe")} />
              <ChatItem name="Julien Dev" active={selectedChat === "Julien Dev"} onClick={() => setSelectedChat("Julien Dev")} />
            </>
          ) : (
            <>
              <p className="px-2 pt-4 pb-2 text-[11px] font-bold uppercase text-[#949BA4]">Tes Amis</p>
              <FriendItem name="Capitaine Price" status="En ligne" />
              <FriendItem name="Ghost" status="Absent" />
            </>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#313338]">
        
        <header className="h-12 border-b border-[#1F2124] flex items-center px-4 shadow-sm">
          <Hash size={20} className="text-[#80848E] mr-2" />
          <span className="font-bold text-white uppercase">{selectedChat}</span>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            <MessageRow user="Besique Monroe" content="Salut ! Tu as avancé sur le projet Spring ?" time="10:00" />
            <MessageRow user="Moi" content="Yes, la Navbar est finie, je bosse sur le chat React là." time="10:05" isMe />
            <MessageRow user="Besique Monroe" content="Super ! N'oublie pas les dossiers pour le 20 février." time="10:06" />
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center gap-4">
            <PlusCircle size={22} className="text-[#B5BAC1] hover:text-white cursor-pointer" />
            <input 
              type="text" 
              placeholder={`Écrire à @${selectedChat}`}
              className="bg-transparent flex-1 text-[#DBDEE1] outline-none" 
            />
            <button className="text-[#B5BAC1] hover:text-white">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};


const ChatItem = ({ name, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${active ? 'bg-[#404249] text-white' : 'hover:bg-[#35373C] text-[#949BA4]'}`}
  >
    <div className="w-8 h-8 rounded-full bg-[#EF3C56] flex items-center justify-center text-white font-bold text-xs">
      {name[0]}
    </div>
    <span className="text-sm font-medium">{name}</span>
  </div>
);

const FriendItem = ({ name, status }) => (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#35373C] cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-[#404249] flex items-center justify-center text-[#EF3C56] font-bold text-xs">{name[0]}</div>
      <div>
        <p className="text-sm font-medium text-[#DBDEE1]">{name}</p>
        <p className="text-[10px] text-[#949BA4]">{status}</p>
      </div>
    </div>
);

const MessageRow = ({ user, content, time, isMe }) => (
  <div className="flex items-start gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1 group">
    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${isMe ? 'bg-[#EF3C56] text-white' : 'bg-[#404249] text-[#EF3C56]'}`}>
      {user[0]}
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-sm text-[#EF3C56]">{user}</span>
        <span className="text-[10px] text-[#949BA4]">{time}</span>
      </div>
      <p className="text-[#DBDEE1] text-[15px]">{content}</p>
    </div>
  </div>
);