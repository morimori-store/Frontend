// app/funding/_components/CategoryFilter.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterItem {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: CategoryFilterItem[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 선택된 카테고리 ID들 가져오기
  const selectedCategoryIds =
    searchParams.get('category')?.split(',').filter(Boolean).map(Number) || [];

  const toggle = (id: number) => {
    const params = new URLSearchParams(searchParams);

    let categoryIds =
      params.get('category')?.split(',').filter(Boolean).map(Number) || [];

    // 토글: 이미 선택되어 있으면 제거, 없으면 추가
    if (categoryIds.includes(id)) {
      categoryIds = categoryIds.filter((c) => c !== id);
    } else {
      categoryIds.push(id);
    }

    // category 업데이트
    if (categoryIds.length > 0) {
      params.set('category', categoryIds.join(','));
    } else {
      params.delete('category');
    }

    // 페이지를 첫 페이지로 리셋
    params.set('page', '0');

    router.push(`/funding?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 my-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => toggle(category.id)}
          className={`border rounded-[20px] px-4 py-2 text-sm transition-colors ${
            selectedCategoryIds.includes(category.id)
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
