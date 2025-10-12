// app/funding/[id]/page.tsx
import { notFound } from 'next/navigation';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import AuthorInfo from './components/AuthorInfo';

// API 함수
async function getFundingDetail(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fundings/${id}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data; // API 응답 구조에 맞게 조정
  } catch (error) {
    console.error('펀딩 상세 조회 실패:', error);
    return null;
  }
}

interface FundingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FundingDetailPage({
  params,
}: FundingDetailPageProps) {
  const resolvedParams = await params;
  const funding = await getFundingDetail(resolvedParams.id);

  if (!funding) {
    notFound();
  }

  const productImages = [
    funding.imageUrl,
    '/productImages/funding1.png',
    '/productImages/funding2.png',
    '/productImages/funding3.png',
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Product Images - 클라이언트 컴포넌트 */}
          <ProductImages images={productImages} />

          {/* Product Info - 클라이언트 컴포넌트 */}
          <ProductInfo
            id={funding.id}
            title={funding.title}
            category={funding.categoryName}
            currentAmount={funding.currentAmount}
            targetAmount={funding.targetAmount}
            remainingDays={funding.remainingDays}
            participantCount={funding.participantCount}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Product Tabs - 클라이언트 컴포넌트 */}
          <ProductTabs
            fundingId={funding.id}
            description={funding.description}
          />

          {/* Author Info - 클라이언트 컴포넌트 */}
          <AuthorInfo
            authorName={funding.authorName}
            authorDescription="작가님은 뉴욕에 거주하며..."
          />
        </div>
      </main>
    </div>
  );
}
