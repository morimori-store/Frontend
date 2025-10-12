// app/funding/_components/FilterSidebar.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 선택된 값들 가져오기
  const currentStatuses = searchParams.get('status')?.split(',') || [];
  const currentPriceRange = searchParams.get('priceRange') || '';

  const toggleStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);

    let statuses = params.get('status')?.split(',').filter(Boolean) || [];

    // 토글: 이미 선택되어 있으면 제거, 없으면 추가
    if (statuses.includes(status)) {
      statuses = statuses.filter((s) => s !== status);
    } else {
      statuses.push(status);
    }

    // status 업데이트
    if (statuses.length > 0) {
      params.set('status', statuses.join(','));
    } else {
      params.delete('status');
    }

    params.set('page', '0');
    router.push(`/funding?${params.toString()}`);
  };

  const selectPriceRange = (priceId: string) => {
    const params = new URLSearchParams(searchParams);

    // 가격 범위를 minPrice, maxPrice로 변환
    params.delete('minPrice');
    params.delete('maxPrice');

    switch (priceId) {
      case 'under10k':
        params.set('maxPrice', '10000');
        break;
      case '10k-30k':
        params.set('minPrice', '10000');
        params.set('maxPrice', '30000');
        break;
      case '30k-50k':
        params.set('minPrice', '30000');
        params.set('maxPrice', '50000');
        break;
      case 'over50k':
        params.set('minPrice', '50000');
        break;
      case 'all':
        // 전체 선택 시 minPrice, maxPrice 제거
        break;
    }

    // priceRange는 UI 표시용으로만 저장 (선택적)
    if (priceId === 'all') {
      params.delete('priceRange');
    } else {
      params.set('priceRange', priceId);
    }

    params.set('page', '0');
    router.push(`/funding?${params.toString()}`);
  };

  return (
    <aside className="bg-[#f6f4eb] px-[38px] py-[29px] min-h-[calc(100vh-300px)]">
      <div className="space-y-6">
        {/* 진행 상황 - 여러 개 선택 가능 (checkbox) */}
        <div>
          <h2 className="font-bold text-[18px] mb-3">진행 상황</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={currentStatuses.includes('OPEN')}
                onChange={() => toggleStatus('OPEN')}
              />
              <span className="text-sm">진행 중</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={currentStatuses.includes('CLOSED')}
                onChange={() => toggleStatus('CLOSED')}
              />
              <span className="text-sm">종료</span>
            </label>
          </div>
        </div>

        {/* 가격대 - 하나만 선택 가능 (radio) */}
        <div>
          <h2 className="font-bold text-[18px] mb-3">가격대</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                className="w-4 h-4"
                checked={currentPriceRange === ''}
                onChange={() => selectPriceRange('all')}
              />
              <span className="text-sm">전체</span>
            </label>
            {[
              { id: 'under10k', label: '10,000원 이하' },
              { id: '10k-30k', label: '10,000~30,000원' },
              { id: '30k-50k', label: '30,000원~50,000원' },
              { id: 'over50k', label: '50,000원 이상' },
            ].map((price) => (
              <label
                key={price.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="priceRange"
                  className="w-4 h-4"
                  checked={currentPriceRange === price.id}
                  onChange={() => selectPriceRange(price.id)}
                />
                <span className="text-sm">{price.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
