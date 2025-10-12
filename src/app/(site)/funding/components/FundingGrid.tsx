// app/funding/_components/FundingGrid.tsx
import FundingCard from '@/components/funding/FundingCard';
import { FundingItem } from '../../../../types/funding';

interface FundingGridProps {
  fundings: FundingItem[];
}

export function FundingGrid({ fundings }: FundingGridProps) {
  if (!fundings) return <p>펀딩이 없습니다</p>;
  return (
    <div className="grid grid-cols-4 gap-6 mb-10 w-full max-w-5xl">
      {fundings.map((funding) => (
        <div key={funding.id}>
          <FundingCard data={funding} />
        </div>
      ))}
    </div>
  );
}
