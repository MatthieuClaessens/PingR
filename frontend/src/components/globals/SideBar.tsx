"use client";

import { useNavigate } from "react-router-dom";
import { X, Users } from "lucide-react";
import type { Conversation } from "../../entities/conversation";

export interface SidebarProps {
    myId: number;
    isOpen?: boolean;
    onClose?: () => void;
    conversations?: Conversation[];
}

export const Sidebar = ({ myId, isOpen = true, onClose, conversations = [] }: SidebarProps) => {
    const navigate = useNavigate();

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
                    <span>Messages ({conversations.length})</span>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-[#979797]">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Aucune conversation</p>
                            <p className="text-sm mt-2 opacity-75">
                                Cherche quelqu'un pour commencer à discuter
                            </p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const participants = conv.participants || [];
                            const isGroup = conv.conversationType === 'GROUP';
                            const others = participants.filter((p: any) => p.accountId !== myId);

                            const displayName = isGroup
                                ? others.slice(0, 2).map((p: any) => p.accountName).join(", ") + (others.length > 2 ? ` +${others.length - 2}` : "")
                                : (others[0]?.accountName || "Utilisateur");

                            return (
                                <div
                                    key={conv.conversationId}
                                    onClick={() => handleConvClick(conv.conversationId!)}
                                    className="p-4 hover:bg-[#252525] cursor-pointer transition-all border-b border-white/[0.02] flex items-center gap-3 group rounded-lg mx-1 mb-1"
                                >
                                    <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-md
                                        ${isGroup
                                            ? 'bg-orange-500/15 border-2 border-orange-500/30 text-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-orange-500/25'
                                            : 'bg-[#EF3C56]/15 border-2 border-[#EF3C56]/30 text-[#EF3C56] group-hover:bg-[#EF3C56] group-hover:text-white group-hover:shadow-[#EF3C56]/25'
                                        }`}
                                    >
                                        {isGroup ? <Users size={16} /> : displayName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="text-sm font-bold text-[#EEEEEE] truncate leading-tight">
                                            {displayName}
                                        </div>
                                        <div className="text-[10px] text-[#666666] font-medium uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                            {isGroup
                                                ? `${others.length} membre${others.length > 1 ? 's' : ''}`
                                                : 'privé'
                                            }
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
