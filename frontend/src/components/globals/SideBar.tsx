"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import http from "../../api/http-common";
import type { Conversation } from "../../entities/conversation";

export interface SidebarProps {
    myId: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ myId, isOpen = true, onClose }: SidebarProps) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        http.get("/conversations/all")
            .then(res => {
                const convs = res.data.content || res.data;
                setConversations(convs);
            })
            .catch(err => console.error("Erreur sidebar:", err));
    }, []);

    const handleConvClick = (convId: number) => {
        navigate(`/conversation/${convId}`);
        if (onClose) onClose();
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            <div
                className={`
                    w-72 sm:w-80 h-full bg-[#181818] border-r border-[#2A2A2A] flex flex-col shrink-0
                    fixed lg:relative inset-y-0 left-0 z-50
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:transform-none lg:translate-x-0
                `}
            >
                <div className="h-16 flex items-center justify-between px-6 font-bold text-[#EEEEEE] border-b border-[#2A2A2A] bg-[#121212]">
                    <span>Messages</span>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.length === 0 ? (
                        <p className="p-6 text-xs text-[#555555] text-center italic">
                            Aucune conversation trouvée
                        </p>
                    ) : (
                        conversations.map((conv) => {
                            const otherUser = conv.participants?.find(p => p.accountId !== myId);
                            const displayName = otherUser ? otherUser.accountName : "Mon compte";
                            return (
                                <div
                                    key={conv.conversationId}
                                    onClick={() => handleConvClick(conv.conversationId)}
                                    className="p-4 hover:bg-[#252525] cursor-pointer transition-all border-b border-white/[0.02] flex items-center gap-3 group"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-[#EF3C56]/10 border border-[#EF3C56]/20 flex items-center justify-center font-bold text-[#EF3C56] group-hover:bg-[#EF3C56] group-hover:text-white transition-all">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-[#EEEEEE] truncate">
                                            {displayName}
                                        </div>
                                        <div className="text-[10px] text-[#555555] font-medium uppercase tracking-wider">
                                            Cliquez pour discuter
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};