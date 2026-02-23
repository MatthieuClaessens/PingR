"use client";

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Users } from "lucide-react";
import type { Conversation } from "../../entities/conversation";

export interface SidebarProps {
    myId: number;
    isOpen?: boolean;
    onClose?: () => void;
    conversations?: Conversation[];
    onRefresh?: () => void;
}

export const Sidebar = ({ 
    myId, 
    isOpen = true, 
    onClose, 
    conversations = [], 
    onRefresh 
}: SidebarProps) => {
    const navigate = useNavigate();
    const { id: currentConvId } = useParams();

    const handleConvClick = (convId: number) => {
        navigate(`/conversation/${convId}`);
        if (onClose) onClose();
    };

    useEffect(() => {
        if (!onRefresh) return;

        onRefresh();

        const interval = setInterval(() => {
            onRefresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [onRefresh]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`
                    w-72 sm:w-80 h-full bg-[#181818] border-r border-[#2A2A2A] flex flex-col shrink-0
                    fixed lg:relative inset-y-0 left-0 z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:transform-none lg:translate-x-0
                `}
            >
                <div className="h-16 flex items-center justify-between px-6 font-bold text-[#EEEEEE] border-b border-[#2A2A2A] bg-[#121212]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#EF3C56] animate-pulse"></span>
                        <span className="tracking-tight">Conversations <span className="text-white bg-[#EF3C56] rounded-full px-2 py-0.5 text-xs">{conversations.length}</span></span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {conversations.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-16 h-16 bg-[#252525] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#333]">
                                <Users size={30} className="text-gray-600" />
                            </div>
                            <p className="text-sm font-semibold text-gray-400">Aucune discussion</p>
                            <p className="text-[11px] text-gray-600 mt-1 uppercase tracking-wider">Lancez-vous !</p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const participants = conv.participants || [];
                            const isGroup = conv.conversationType === 'GROUP';
                            const others = participants.filter((p: any) => p.accountId !== myId);
                            const isActive = currentConvId === String(conv.conversationId);

                            const displayName = isGroup
                                ? (others.slice(0, 2).map((p: any) => p.accountName).join(", ") + (others.length > 2 ? ` +${others.length - 2}` : ""))
                                : (others[0]?.accountName || "Utilisateur");

                            return (
                                <div
                                    key={conv.conversationId}
                                    onClick={() => handleConvClick(conv.conversationId!)}
                                    className={`
                                        group relative p-3 cursor-pointer transition-all flex items-center gap-3 rounded-xl mx-1
                                        ${isActive 
                                            ? 'bg-[#EF3C56]/10 border border-[#EF3C56]/20' 
                                            : 'hover:bg-[#252525] border border-transparent'
                                        }
                                    `}
                                >
                                    <div className={`
                                        h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs transition-all shadow-sm border
                                        ${isGroup
                                            ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white'
                                            : 'bg-[#EF3C56]/10 text-[#EF3C56] border-[#EF3C56]/20 group-hover:bg-[#EF3C56] group-hover:text-white'
                                        } 
                                        ${isActive && !isGroup ? 'bg-[#EF3C56] text-white' : ''} 
                                        ${isActive && isGroup ? 'bg-orange-500 text-white' : ''}
                                    `}>
                                        {isGroup ? <Users size={16} /> : displayName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-white' : 'text-[#EEEEEE]'}`}>
                                            {displayName}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-[#EF3C56]' : 'text-[#555]'}`}>
                                                {isGroup ? 'Groupe' : 'Direct'}
                                            </span>
                                            <span className="text-[10px] text-[#444]">•</span>
                                            <span className="text-[10px] text-[#666] font-medium truncate">
                                                {isGroup ? `${participants.length} membres` : 'Privé'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {isActive && (
                                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#EF3C56] shadow-[0_0_8px_#EF3C56]"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};