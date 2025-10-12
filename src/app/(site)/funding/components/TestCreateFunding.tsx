'use client';

import Button from '@/components/Button';
import { createNewFunding } from '@/utils/api/funding';

function TestCreateFunding() {
  const handleCreateFunding = async () => {
    await createNewFunding({
      title: '포카칩 pro max',
      description: '맛있는 포카칩',
      categoryId: 0,
      imageUrl:
        'https://i.namu.wiki/i/1xpHfMVtPVhBnkTV5eZOdqtLiafYS93RhGKcavsc8shwJmgkv2rcmpg2D6X42pOEzb3B8rT3Rkr97Gcc6GMvUA.webp',
      targetAmount: 50,
      startDate: '2025-10-12T16:37:20.862Z',
      endDate: '2025-10-13T16:37:20.862Z',
      options: [
        {
          name: '양파맛',
          price: 5000,
          stock: 20,
          sortOrder: 50,
        },
      ],
    });
  };
  return <Button onClick={handleCreateFunding}>새로운 펀딩 만들기</Button>;
}
export default TestCreateFunding;
