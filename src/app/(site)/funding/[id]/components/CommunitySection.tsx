// app/funding/[id]/_components/CommunitySection.tsx
'use client';

import { useState } from 'react';
import PlusBtn from '@/assets/icon/plusBtn.svg';
import TrashCan from '@/assets/icon/trashcan.svg';

interface Message {
  id: number;
  user: string;
  time: string;
  content: string;
  isAuthor: boolean;
}

interface CommunitySectionProps {
  fundingId: number;
}

export default function CommunitySection({ fundingId }: CommunitySectionProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: '유저 이름',
      time: '1분전',
      content: '맛집내용\n테스트 댓글입니다.',
      isAuthor: true,
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        user: '유저 이름',
        time: '방금전',
        content: newMessage,
        isAuthor: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border ${
              message.isAuthor
                ? 'bg-green-50 border-green-200 ml-4'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">👤</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{message.user}</div>
                  <div className="text-xs text-gray-500">{message.time}</div>
                </div>
              </div>
              <div className="flex gap-3">
                {message.isAuthor && (
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">
                    작가
                  </button>
                )}
                <button className="hover:cursor-pointer">
                  <TrashCan />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-200 h-[1px] w-full my-[40px]" />

      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-3">댓글</h3>
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="댓글을 남겨주세요..."
            className="flex-1 px-4 py-3 rounded-[22px] border border-gray-400 bg-primary-20 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>
            <PlusBtn />
          </button>
        </div>
      </div>
    </div>
  );
}
