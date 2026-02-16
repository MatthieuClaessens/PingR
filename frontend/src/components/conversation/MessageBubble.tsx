import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit2, Trash2, Check, X } from "lucide-react";
import type { Message } from "../../entities/message";

interface MessageBubbleProps {
    msg: Message;
    isMe: boolean;
    isGroup: boolean;
    onEdit: (id: number, content: string) => Promise<void>;
    onDelete: (id: number) => void;
}

const getParticipantColor = (name: string) => {
    const colors = [
        "text-blue-400",
        "text-emerald-400",
        "text-violet-400",
        "text-amber-400",
        "text-rose-400",
        "text-cyan-400",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    msg,
    isMe,
    isGroup,
    onEdit,
    onDelete,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(msg.messageContent);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [editText]);

    const handleSave = async () => {
        await onEdit(msg.messageId, editText);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm("Vraiment supprimer ce message ? 😢")) {
            onDelete(msg.messageId);
            setMenuOpen(false);
        }
    };

    return (
        <div
            className={`max-w-[75%] ${isMe ? "self-end" : "self-start"
                } group relative mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
            {!isMe && (
                <span
                    className={`text-[11px] ml-2 mb-1 block font-bold tracking-tight uppercase opacity-80 ${getParticipantColor(
                        msg.userAccount?.accountName || "Anonyme"
                    )}`}
                >
                    {msg.userAccount?.accountName}
                </span>
            )}

            <div
                className={`p-3.5 rounded-2xl text-sm shadow-md relative transition-all group-hover:shadow-lg
          ${isMe
                        ? "bg-gradient-to-br from-[#EF3C56] via-[#EF3C56] to-[#D6304E] text-white rounded-br-none"
                        : "bg-[#262626] text-gray-100 rounded-bl-none border border-[#333] hover:border-[#444]"
                    }`}
            >
                {isMe && !isEditing && (
                    <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="h-8 w-8 bg-[#1A1A1A] border border-white/10 rounded-full flex items-center justify-center hover:bg-[#333] transition-all"
                        >
                            <MoreHorizontal size={16} className="text-gray-400" />
                        </button>

                        {menuOpen && (
                            <div className="absolute top-10 right-0 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl py-1.5 w-[130px] z-30">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-white"
                                >
                                    <Edit2 size={14} className="text-blue-400" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-3 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-900/20 flex items-center gap-2 mt-1"
                                >
                                    <Trash2 size={14} />
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isEditing ? (
                    <div className="space-y-2 min-w-[200px]">
                        <textarea
                            ref={textareaRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-black/30 text-white p-2 rounded-lg border border-white/20 focus:outline-none resize-none text-sm"
                            rows={2}
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={handleSave}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs flex items-center gap-1"
                            >
                                <Check size={14} /> Valider
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-xs flex items-center gap-1"
                            >
                                <X size={14} /> Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {msg.messageContent}
                        </p>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                            <span className="text-[9px] font-mono opacity-50 uppercase tracking-tighter">
                                {new Date(msg.messageDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};