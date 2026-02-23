"use client";

import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    placeholderName: string;
}

export const MessageInput = ({ onSendMessage, placeholderName }: MessageInputProps) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessage((prev) => prev + emoji);
    };

    return (
        <div className="p-4 bg-[#121212] border-t border-[#2A2A2A]">
            <div className="max-w-6xl mx-auto flex items-end gap-2 bg-[#1E1E1E] rounded-2xl p-2 border border-[#333] focus-within:border-[#EF3C56]/50 transition-all shadow-lg">

                <div className="pb-1 px-1">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                </div>

                <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={`Écrire à ${placeholderName}...`}
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2 resize-none max-h-32 custom-scrollbar"
                />

                <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`p-2 rounded-xl transition-all ${message.trim()
                            ? "bg-[#EF3C56] text-white hover:scale-105 active:scale-95 shadow-md shadow-[#EF3C56]/20"
                            : "text-gray-600 cursor-not-allowed"
                        }`}
                >
                    <SendHorizontal size={20} />
                </button>
            </div>
        </div>
    );
};