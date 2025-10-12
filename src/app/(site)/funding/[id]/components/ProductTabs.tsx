// app/funding/[id]/_components/ProductTabs.tsx
'use client';

import { useState } from 'react';
import NewsInputModal from '@/components/funding/NewsInputModal';
import CommunitySection from './CommunitySection';

interface ProductTabsProps {
  fundingId: number;
  description: string;
}

export default function ProductTabs({
  fundingId,
  description,
}: ProductTabsProps) {
  const [selectedTab, setSelectedTab] = useState('description');

  return (
    <div className="bg-white rounded-lg shadow-sm w-full max-w-[760px]">
      <nav className="flex text-4 font-semibold">
        <button
          onClick={() => setSelectedTab('description')}
          className={`flex-1 px-6 py-2 border-1 border-tertiary ${
            selectedTab === 'description'
              ? 'bg-tertiary text-white'
              : 'text-tertiary hover:bg-tertiary-20'
          }`}
        >
          프로젝트 소개
        </button>
        <button
          onClick={() => setSelectedTab('details')}
          className={`flex-1 px-6 py-2 border-1 border-tertiary ${
            selectedTab === 'details'
              ? 'bg-tertiary text-white'
              : 'text-tertiary hover:bg-tertiary-20'
          }`}
        >
          새 소식
        </button>
        <button
          onClick={() => setSelectedTab('shipping')}
          className={`flex-1 px-6 py-2 border-1 border-tertiary ${
            selectedTab === 'shipping'
              ? 'bg-tertiary text-white'
              : 'text-tertiary hover:bg-tertiary-20'
          }`}
        >
          커뮤니티
        </button>
      </nav>

      <div className="p-6">
        {selectedTab === 'description' && (
          <div>
            <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center text-gray-500 mb-6">
              상세 페이지 이미지
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
          </div>
        )}

        {selectedTab === 'details' && (
          <div className="bg-white rounded-lg shadow-sm flex flex-col">
            <div className="ml-auto">
              <NewsInputModal />
            </div>
            <div className="text-gray-500 p-6">
              새 소식 내용이 여기에 표시됩니다.
            </div>
          </div>
        )}

        {selectedTab === 'shipping' && (
          <CommunitySection fundingId={fundingId} />
        )}
      </div>
    </div>
  );
}
