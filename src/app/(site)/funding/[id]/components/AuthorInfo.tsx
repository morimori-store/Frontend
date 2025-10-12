// app/funding/[id]/_components/AuthorInfo.tsx
'use client';

import { useState } from 'react';
import Favorite from '@/assets/icon/bookmark.svg';
import EmptyFavorite from '@/assets/icon/empty_bookmark.svg';

interface AuthorInfoProps {
  authorName: string;
  authorDescription: string;
}

export default function AuthorInfo({
  authorName,
  authorDescription,
}: AuthorInfoProps) {
  const [isFavoriteAuthor, setIsFavoriteAuthor] = useState(false);

  return (
    <div className="space-y-8 ml-[92px]">
      <div className="bg-green-50 p-6 rounded-lg max-w-[366px] flex flex-col">
        <div className="text-center mb-4">
          <div className="flex">
            <h3 className="font-semibold">작가 소개</h3>
            <button
              className="ml-auto"
              onClick={() => setIsFavoriteAuthor((prev) => !prev)}
            >
              {isFavoriteAuthor ? <Favorite /> : <EmptyFavorite />}
            </button>
          </div>
          <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-2" />
          <h2 className="font-bold">{authorName}</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {authorDescription}
        </p>
        <button className="mt-4 border p-2 rounded-[4px] ml-auto bg-white text-primary hover:underline">
          작가페이지→
        </button>
      </div>
    </div>
  );
}
