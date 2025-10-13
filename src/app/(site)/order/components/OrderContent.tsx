'use client';

import React from 'react';
import { useOrderStore } from '@/app/(site)/order/stores/orderStore';
import CartSection from './CartSection';
import OrderSummary from './OrderSummary';

const OrderContent = () => {
  const { cartItems } = useOrderStore();

  // 초기 데이터 설정 (개발용 목업 데이터)
  React.useEffect(() => {
    if (cartItems.length === 0) {
      useOrderStore.setState({
        cartItems: [
          {
            id: 1,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 1,
            image: '/cart-item1.jpg',
            isChecked: true,
            isRegular: true,
          },
          {
            id: 2,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 0,
            image: '/cart-item2.jpg',
            isChecked: true,
            isRegular: true,
          },
          {
            id: 3,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 1,
            image: '/cart-item3.jpg',
            isChecked: true,
            isRegular: false,
          },
          {
            id: 4,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 1,
            image: '/cart-item4.jpg',
            isChecked: false,
            isRegular: false,
          },
        ],
      });
    }
  }, [cartItems.length]);

  const regularItems = cartItems.filter((item) => item.isRegular);
  const fundingItems = cartItems.filter((item) => !item.isRegular);

  return (
    <>
      <CartSection
        title="일반 장바구니"
        items={regularItems}
        isRegular={true}
      />

      <CartSection
        title="펀딩 장바구니"
        items={fundingItems}
        isRegular={false}
      />

      <OrderSummary />
    </>
  );
};

export default OrderContent;
