"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical, Users, UserPlus, X, Search, ShieldCheck, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "../../entities/conversation";
import http from "../../api/http-common";
import { conversationService } from "../../services/conversationService";

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
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

    const searchRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);

    const others = selectedConv.participants?.filter(p => p.accountId !== myId) || [];
    const isGroup = selectedConv.conversationType === 'GROUP';

    const displayName = isGroup
        ? (others.length > 0 ? others.map(p => p.accountName).join(", ") : "Groupe")
        : (others[0]?.accountName || "Utilisateur");

    const handleLeaveAction = async () => {
        if (!isGroup) return;
        if (!window.confirm("Voulez-vous vraiment quitter ce groupe ?")) return;

        try {
            await conversationService.leaveConversation(selectedConv.conversationId);
            setShowMore(false);
            navigate("/home");
            window.location.reload();
        } catch (err) {
            console.error("Erreur lors du départ du groupe:", err);
            alert("Erreur lors de l'action.");
        }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const response = await http.get<UserSearchResult[]>(`/user/search?q=${searchQuery}`);
                    const filtered = response.data.filter(user =>
                        !selectedConv.participants?.some(p => p.accountId === user.accountId)
                    );
                    setSearchResults(filtered);
                } catch { setSearchResults([]); }
            } else { setSearchResults([]); }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedConv.participants]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (searchRef.current && !searchRef.current.contains(target)) {
                setIsSearching(false);
                setSearchQuery("");
            }
            if (moreRef.current && !moreRef.current.contains(target)) {
                setShowMore(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-20 px-4 sm:px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818] shrink-0 relative z-40">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-lg
                    ${isGroup ? 'bg-orange-600' : 'bg-[#EF3C56]'}`}>
                    {isGroup ? <Users size={20} /> : displayName.charAt(0).toUpperCase()}
                </div>

                {!isSearching ? (
                    <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-lg truncate text-white text-left">{displayName}</h3>
                        <div className="flex items-center gap-2">
                            {isGroup ? (
                                <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                                    {(selectedConv.participants?.length || 0)} membres
                                </span>
                            ) : (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[10px] sm:text-xs text-green-500 font-medium">En ligne</span>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div ref={searchRef} className="flex items-center bg-[#2A2A2A] rounded-full px-3 py-1.5">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input
                            autoFocus
                            className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-32 sm:w-64"
                            placeholder="Inviter quelqu'un..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-6 text-gray-400 shrink-0">
                <button
                    onClick={() => setIsSearching(!isSearching)}
                    className={`p-2 rounded-full transition-all ${isSearching ? 'bg-[#EF3C56] text-white rotate-90' : 'hover:text-[#EF3C56] hover:bg-white/5'}`}
                >
                    <UserPlus size={20} />
                </button>

                <div className="h-6 w-[1px] bg-[#2A2A2A] hidden sm:block"></div>
                <button className="hover:text-white hidden sm:block transition-colors"><Phone size={20} /></button>
                <button className="hover:text-white hidden sm:block transition-colors"><Video size={20} /></button>

                <div className="relative" ref={moreRef}>
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={`p-2 rounded-full transition-colors ${showMore ? 'text-white bg-white/10' : 'hover:text-white hover:bg-white/5'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMore && (
                        <div className="absolute top-full right-0 mt-2 w-52 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 text-left transition-colors">
                                <Users size={16} /> Voir les membres
                            </button>

                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 text-left transition-colors">
                                <Search size={16} /> Rechercher dans le chat
                            </button>

                            {isGroup && (
                                <>
                                    <div className="h-[1px] bg-[#2A2A2A] my-1 mx-2"></div>
                                    <button
                                        onClick={handleLeaveAction}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF3C56] hover:bg-[#EF3C56]/10 text-left font-medium transition-colors"
                                    >
                                        <LogOut size={16} /> Quitter le groupe
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isSearching && searchQuery.length >= 2 && (
                <div ref={resultsRef} className="absolute top-[75px] left-4 sm:left-8 w-64 sm:w-72 bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-2xl z-[9999] overflow-hidden">
                    <div className="p-2 text-left">
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
                                    className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] rounded-lg cursor-pointer group"
                                >
                                    <div className="h-8 w-8 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-xs text-[#EF3C56] font-bold group-hover:bg-[#EF3C56] group-hover:text-white transition-colors">
                                        {user.accountName?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm text-gray-200 group-hover:text-white flex items-center gap-1 truncate font-medium">
                                            {user.accountName}
                                            {user.role === 'ADMIN' && <ShieldCheck size={12} className="text-[#EF3C56]" />}
                                        </span>
                                        <span className="text-[10px] text-gray-500">Cliquer pour inviter</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-xs text-gray-500 italic">Aucun utilisateur trouvé</p>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};