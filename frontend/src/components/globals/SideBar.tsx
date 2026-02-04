"use client";

import { useEffect, useState } from "react";
import http from "../../api/http-common";
import type { Conversation } from "../../entities/conversation";

export interface SidebarProps {
    onSelectConv: (conv: Conversation) => void;
    myId: number;
}

export const Sidebar = ({ onSelectConv, myId }: SidebarProps) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        http.get("/conversations/all")
            .then(res => setConversations(res.data))
            .catch(err => console.error("Erreur sidebar:", err));
    }, []);

    return (
        <div className="w-80 h-full bg-[#181818] border-r border-[#2A2A2A] flex flex-col shrink-0">
            <div className="h-16 flex items-center px-6 font-bold text-[#EEEEEE] border-b border-[#2A2A2A] bg-[#121212]">
                Messages
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations.length === 0 ? (
                    <p className="p-6 text-xs text-[#555555] text-center italic">Aucune conversation trouvée</p>
                ) : (
                    conversations.map((conv) => {
                        const otherUser = conv.participants?.find(p => p.accountId !== myId);
                        const displayName = otherUser ? otherUser.accountName : "Mon compte";
                        return (
                            <div key={conv.conversationId} onClick={() => onSelectConv(conv)}
                                className="p-4 hover:bg-[#252525] cursor-pointer transition-all border-b border-white/[0.02] flex items-center gap-3 group"
                            >
                                <div className="h-11 w-11 rounded-xl bg-[#EF3C56]/10 border border-[#EF3C56]/20 flex items-center justify-center font-bold text-[#EF3C56] group-hover:bg-[#EF3C56] group-hover:text-white transition-all">
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
    );
}