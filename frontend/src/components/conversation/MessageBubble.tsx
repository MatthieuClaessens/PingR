"use client";

import React from 'react';

interface MessageBubbleProps {
  content: string;
  isMe: boolean;
  timestamp?: string;
}

export default function MessageBubble({ content, isMe, timestamp }: MessageBubbleProps) {
  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div className={`max-w-[70%] px-4 py-2 shadow-md ${isMe ? 'bg-[#EF3C56] text-white rounded-2xl rounded-tr-none'
          : 'bg-[#2A2A2A] text-[#EEEEEE] rounded-2xl rounded-tl-none'
        }`}>
        <p className="text-sm wrap-break-words">{content}</p>
        {timestamp && <div className="text-[10px] mt-1 opacity-60 text-right">{timestamp}</div>}
      </div>
    </div>
  );
}