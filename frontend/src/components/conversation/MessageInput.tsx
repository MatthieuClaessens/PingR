import React, { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
    onSendMessage: (text: string) => Promise<void>;
    placeholderName: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, placeholderName }) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        await onSendMessage(inputText);
        setInputText("");
    };

    return (
        <footer className="p-6 bg-[#121212] border-t border-[#2A2A2A]">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto flex items-center bg-[#181818] rounded-2xl border border-[#2A2A2A] p-2 focus-within:border-[#EF3C56] transition-all shadow-lg"
            >
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Écris à ${placeholderName}...`}
                    className="flex-1 bg-transparent outline-none px-4 py-2 text-white placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="h-10 w-10 bg-[#EF3C56] disabled:bg-gray-800 disabled:text-gray-500 rounded-xl flex items-center justify-center hover:bg-[#d6354d] transition-all active:scale-95 shrink-0"
                >
                    <Send size={18} />
                </button>
            </form>
        </footer>
    );
};