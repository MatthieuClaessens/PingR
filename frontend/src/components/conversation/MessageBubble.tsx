import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit2, Trash2, Check, X } from "lucide-react";
import type { Message } from "../../entities/message";

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    msg,
    isMe,
    isGroup,
    onEdit,
    onDelete
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(msg.messageContent);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
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
        <div className={`max-w-[70%] ${isMe ? 'self-end' : 'self-start'} group relative mb-2 animate-in slide-in-from-bottom-1`}>
            {!isMe && isGroup && (
                <span className="text-[10px] text-gray-500 ml-2 mb-1 block font-medium tracking-wide">
                    {msg.userAccount?.accountName}
                </span>
            )}

            <div className={`p-3.5 rounded-2xl text-sm shadow-md relative transition-all group-hover:shadow-lg
                ${isMe 
                    ? "bg-gradient-to-br from-[#EF3C56] via-[#EF3C56] to-[#D6304E] text-white rounded-br-none hover:from-[#FF4757] hover:to-[#E84393]" 
                    : "bg-gradient-to-tr from-[#2A2A2A] to-[#1E1E1E] text-gray-100 rounded-bl-none border border-[#333] hover:border-[#555]"
                }`}>
                
                {isMe && !isEditing && (
                    <div className="absolute -top-2.5 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-0 group-hover:scale-100">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(true);
                            }}
                            className="h-7 w-7 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/40 shadow-2xl hover:shadow-white/20 transition-all duration-200 hover:rotate-90"
                        >
                            <MoreHorizontal size={14} className="text-gray-300" />
                        </button>

                        {/* Menu popup */}
                        {menuOpen && (
                            <div className="absolute top-8 right-0 bg-black/95 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl py-1.5 w-[110px] animate-ping-once">
                                <button
                                    onClick={() => { 
                                        setIsEditing(true); 
                                        setMenuOpen(false); 
                                    }}
                                    className="w-full px-2.5 py-1.5 text-left text-xs font-medium hover:bg-gray-800/50 flex items-center gap-2 rounded-lg transition-all hover:gap-2.5"
                                >
                                    <Edit2 size={12} className="text-blue-400" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-red-400 hover:bg-red-900/30 flex items-center gap-2 rounded-lg transition-all hover:gap-2.5 mt-1"
                                >
                                    <Trash2 size={12} />
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            ref={textareaRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-black/50 backdrop-blur text-white p-2.5 rounded-xl border-2 border-gray-600 focus:border-pink-500/70 focus:outline-none resize-none text-sm placeholder-gray-500 font-medium transition-all shadow-inner"
                            rows={2}
                            autoFocus
                            placeholder="✏️ Édite ton message..."
                        />
                        <div className="flex gap-1.5 justify-end pt-1">
                            <button 
                                onClick={handleSave}
                                className="p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg shadow-md hover:shadow-emerald-400/50 transition-all flex items-center gap-1 text-xs font-medium px-3 py-1.5"
                            >
                                <Check size={12} />
                                OK
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg shadow-md hover:shadow-gray-500/50 transition-all flex items-center gap-1 text-xs px-3 py-1.5"
                            >
                                <X size={12} />
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.messageContent}</p>
                        <span className="text-[10px] block mt-1.5 text-right font-mono opacity-70 tracking-wide">
                            {new Date(msg.messageDate).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};
