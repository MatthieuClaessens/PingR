import React from "react";
import { Phone, Video, MoreVertical, Users } from "lucide-react";
import type { Conversation } from "../../entities/conversation";

interface ConversationHeaderProps {
    selectedConv: Conversation;
    myId: number;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({ selectedConv, myId }) => {
    const others = selectedConv.participants?.filter(p => p.accountId !== myId) || [];

    const isGroup = selectedConv.conversationType === 'GROUP';

    const displayName = isGroup
        ? others.map(p => p.accountName).join(", ")
        : (others[0]?.accountName || "Utilisateur");

    const avatarContent = isGroup ? (
        <Users size={20} className="text-white" />
    ) : (
        displayName.charAt(0).toUpperCase()
    );

    return (
        <header className="h-20 px-8 flex items-center justify-between border-b border-[#2A2A2A] bg-[#181818] shrink-0">
            <div className="flex items-center gap-4 min-w-0">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold shadow-lg transition-colors
          ${isGroup ? 'bg-blue-600' : 'bg-[#EF3C56]'}`}>
                    {avatarContent}
                </div>

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
            </div>

            <div className="flex items-center gap-6 text-gray-500 shrink-0">
                <button className="hover:text-white transition-colors">
                    <Phone size={20} />
                </button>
                <button className="hover:text-white transition-colors">
                    <Video size={20} />
                </button>
                <button className="hover:text-white transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>
        </header>
    );
};