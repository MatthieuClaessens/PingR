"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical, Users, UserPlus, X, Search, ShieldCheck } from "lucide-react";
import type { Conversation } from "../../entities/conversation";
import http from "../../api/http-common";

interface UserSearchResult {
    accountId: number;
    accountName: string;
    role: string;
}

interface ConversationHeaderProps {
    selectedConv: Conversation;
    myId: number;
    onConfirmAdd: (userId: number) => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({ selectedConv, myId, onConfirmAdd }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const others = selectedConv.participants?.filter(p => p.accountId !== myId) || [];
    const isGroup = selectedConv.conversationType === 'GROUP';

    const displayName = isGroup
        ? others.map(p => p.accountName).join(", ")
        : (others[0]?.accountName || "Utilisateur");

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const response = await http.get<UserSearchResult[]>(`/user/search?q=${searchQuery}`);
                    
                    const filteredResults = response.data.filter(user => 
                        !selectedConv.participants.some(p => p.accountId === user.accountId)
                    );
                    
                    setSearchResults(filteredResults);
                } catch (err) {
                    console.error("Erreur recherche header:", err);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedConv.participants]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchRef.current && 
                !searchRef.current.contains(e.target as Node) &&
                resultsRef.current &&
                !resultsRef.current.contains(e.target as Node)
            ) {
                setIsSearching(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-20 px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818] shrink-0 relative">
            <div className="flex items-center gap-4 min-w-0">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold shadow-lg transition-all
                    ${isGroup ? 'bg-orange-600' : 'bg-[#EF3C56]'}`}>
                    {isGroup ? <Users size={20} className="text-white" /> : displayName.charAt(0).toUpperCase()}
                </div>

                {!isSearching ? (
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg truncate text-white" title={displayName}>
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-2">
                            {isGroup ? (
                                <span className="text-xs text-gray-400 font-medium">
                                    {selectedConv.participants.length} membres
                                </span>
                            ) : (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-xs text-green-500 font-medium">En ligne</span>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div ref={searchRef} className="flex items-center bg-[#2A2A2A] rounded-full px-4 py-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <input 
                            autoFocus
                            className="bg-transparent border-none outline-none text-white text-sm w-40 sm:w-64"
                            placeholder="Inviter un utilisateur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={() => { setIsSearching(false); setSearchQuery(""); }}>
                            <X size={16} className="text-gray-400 hover:text-white transition-colors" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6 text-gray-400 shrink-0">
                <button 
                    onClick={() => setIsSearching(!isSearching)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                        isSearching 
                        ? 'bg-[#EF3C56] text-white shadow-[0_0_15px_rgba(239,60,86,0.4)] rotate-90' 
                        : 'hover:text-[#EF3C56] hover:bg-white/5'
                    }`}
                >
                    <UserPlus size={20} />
                </button>
                <div className="h-6 w-[1px] bg-[#2A2A2A]"></div>
                <button className="hover:text-white transition-colors"><Phone size={20} /></button>
                <button className="hover:text-white transition-colors"><Video size={20} /></button>
                <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
            </div>

            {isSearching && searchQuery.length >= 2 && (
                <div 
                    ref={resultsRef}
                    className="absolute top-[75px] left-8 w-72 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in duration-200"
                >
                    <div className="p-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold p-2">Résultats</p>
                        
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div 
                                    key={user.accountId}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onConfirmAdd(user.accountId);
                                        setIsSearching(false);
                                        setSearchQuery("");
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] rounded-lg cursor-pointer group transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-xs text-[#EF3C56] font-bold group-hover:bg-[#EF3C56] group-hover:text-white transition-colors">
                                        {user.accountName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-200 group-hover:text-white flex items-center gap-1">
                                            {user.accountName}
                                            {user.role === 'ADMIN' && <ShieldCheck size={12} className="text-[#EF3C56]" />}
                                        </span>
                                        <span className="text-[10px] text-gray-500">Cliquez pour inviter</span>
                                    </div>
                                    <UserPlus size={14} className="ml-auto text-gray-500 group-hover:text-[#EF3C56] transition-colors" />
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-xs text-gray-500 italic">Aucun utilisateur trouvé ou déjà présent</p>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
