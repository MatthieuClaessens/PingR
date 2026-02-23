"use client";

import React, { useState, useRef, useEffect } from "react";
import { Smile, Search } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJI_DATA = [
  {
    category: "Visages & Émotions",
    emojis: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤔", "🫣", "🤭", "🫢", "🫡", "🤫", "🫠", "🤥", "😶", "😶‍🌫️", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠"]
  },
  {
    category: "Mains & Corps",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦿", "🦶", "👣", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "🫦", "💋"]
  },
  {
    category: "Cœurs & Symboles",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", " AB", " CL", "🅾️", "🆘", "❌", "⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱", "🔞", "📵", "🚭", "❗", "❕", "❓", "❔", "‼️", "⁉️", "🔅", "??", "🔱", "⚜️", "⚠️", "🚸", "🔰", "♻️", "✅", "🈯", "💹", "❇️", "✳️", "❎", "🌐", "💠", "Ⓜ️", "🌀", "💤"]
  },
  {
    category: "Tech & Objets",
    emojis: ["🚀", "🔥", "✨", "🎉", "🎊", "🧨", "✨", "🎈", "🧧", "🎁", "🎂", "💻", "🖥️", "💻", "⌨️", "🖱️", "🖲️", "🕹️", "🎮", "📱", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛", "🔧", "🔨", "⚒️", "⛏️", "🔨", "⚙️", "🧱", "⛓️", "🔗", "📎", "🖇️", "📏", "📐", "📌", "📍", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️", "📝"]
  }
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-all rounded-full ${isOpen ? 'text-[#EF3C56] bg-[#EF3C56]/10 rotate-12' : 'text-gray-400 hover:text-[#EF3C56] hover:bg-white/5'
          }`}
        title="Ajouter un émoji"
      >
        <Smile size={22} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-3 left-0 w-72 sm:w-80 bg-[#181818] border border-[#2A2A2A] rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-bottom-2">


          <div className="h-72 overflow-y-auto p-3 custom-scrollbar scroll-smooth">
            {EMOJI_DATA.map((group) => (
              <div key={group.category} className="mb-4 last:mb-0">
                <h4 className="text-[10px] font-bold text-gray-600 mb-2 ml-1 uppercase tracking-wider">
                  {group.category}
                </h4>
                <div className="grid grid-cols-7 gap-1">
                  {group.emojis.map((emoji, index) => (
                    <button
                      key={`${group.category}-${index}`}
                      onClick={() => {
                        onSelect(emoji);
                      }}
                      className="text-xl p-1.5 hover:bg-[#EF3C56]/10 rounded-lg transition-all duration-200 hover:scale-125 active:scale-90 flex items-center justify-center"
                    >
                      <span className="drop-shadow-sm">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-[#2A2A2A] bg-[#121212]/50 text-center">
            <p className="text-[9px] text-gray-600 italic">Cliquez pour insérer</p>
          </div>
        </div>
      )}
    </div>
  );
};