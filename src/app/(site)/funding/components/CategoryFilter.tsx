// app/funding/_components/CategoryFilter.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterItem {
  name: string;
}

interface CategoryFilterProps {
  categories: CategoryFilterItem[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log('카테고리들 : ', categories);

  // 현재 선택된 카테고리들 가져오기
  const selectedCategories =
    searchParams.get('category')?.split(',').filter(Boolean) || [];

  const toggle = (name: string) => {
    const params = new URLSearchParams(searchParams);

    let cats = params.get('category')?.split(',').filter(Boolean) || [];

    // 토글: 이미 선택되어 있으면 제거, 없으면 추가
    if (cats.includes(name)) {
      cats = cats.filter((c) => c !== name);
    } else {
      cats.push(name);
    }

    // category 업데이트
    if (cats.length > 0) {
      params.set('category', cats.join(','));
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
          key={category.name}
          onClick={() => toggle(category.name)}
          className={`border rounded-[20px] px-4 py-2 text-sm transition-colors ${
            selectedCategories.includes(category.name)
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
