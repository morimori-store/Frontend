// app/funding/page.tsx
import { HeroSlider } from './components/HeroSlider';
import { FilterSidebar } from './components/FilterSidebar';
import { CategoryFilter } from './components/CategoryFilter';
import { PopularFundingSlider } from './components/PopularFundingSlider';
import { SortDropdown } from './components/SortDropdown';
import { FundingGrid } from './components/FundingGrid';
import { createNewFunding, fetchFundingList } from '@/utils/api/funding';
import { FundingListProps, FundingStatus, SortBy } from '@/types/funding';

type SearchParams = {
  status?: string;
  sortBy?: string;
  keyword?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  size?: string;
};

interface FundingPageProps {
  searchParams: SearchParams;
}

async function getPopularFundings(params: FundingListProps) {
  params.sortBy = 'popular';
  return await fetchFundingList(params);
}

const parseSearchParams = (searchParams: SearchParams): FundingListProps => {
  return {
    status: searchParams.status
      ? (searchParams.status.split(',') as FundingStatus[])
      : undefined,
    sortBy: (searchParams.sortBy as SortBy) || 'popular', // 디폴트: 최신순
    keyword: searchParams.keyword || undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 0, // 디폴트: 0페이지
    size: searchParams.size ? Number(searchParams.size) : 16, // 디폴트: 12개
  };
};

export default async function FundingPage({ searchParams }: FundingPageProps) {
  const resolvedSearchParams = await searchParams;
  const params = parseSearchParams(resolvedSearchParams);

  console.log('params : ', params);
  const fundings = await fetchFundingList(params);
  console.log('fundings : ', fundings);
  const popularFundings = await getPopularFundings(params);

  const categories = [
    { name: '스티커', count: 999 },
    { name: '메모지', count: 999 },
    { name: '노트', count: 999 },
    { name: '액세서리', count: 99 },
    { name: '디지털 문구', count: 99 },
  ];

  return (
    <>
      <HeroSlider />

      <div className="w-full grid grid-cols-[250px_1fr] gap-8">
        <FilterSidebar />

        <main className="flex flex-col items-center px-4">
          <CategoryFilter categories={categories} />

          <PopularFundingSlider fundings={popularFundings} />

          <div className="bg-gray-200 h-[1px] w-full max-w-5xl my-8" />

          <div className="mb-6 w-full max-w-5xl">
            <SortDropdown />
          </div>

          <FundingGrid fundings={fundings} />
          {/* <TestCreateFunding /> */}
        </main>
      </div>
    </>
  );
}
