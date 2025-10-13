'use client';

import React from 'react';
import { useOrderStore } from '@/app/(site)/order/stores/orderStore';
import CartItem from './CartItem';

interface CartSectionProps {
  title: string;
  items: Array<{
    id: number;
    brand: string;
    name: string;
    option: string;
    price: number;
    quantity: number;
    image: string;
    isChecked: boolean;
    isRegular: boolean;
  }>;
  isRegular: boolean;
}

const CartSection = ({ title, items, isRegular }: CartSectionProps) => {
  const { updateCartItem } = useOrderStore();

  const toggleAllCheck = () => {
    const allChecked = items.every((item) => item.isChecked);
    items.forEach((item) => {
      updateCartItem(item.id, { isChecked: !allChecked });
    });
  };

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      {/* 테이블 헤더 */}
      <div className="bg-white border border-gray-300 px-4 py-6 flex items-center">
        <div className="mr-6">
          <input
            type="checkbox"
            onChange={toggleAllCheck}
            checked={items.length > 0 && items.every((item) => item.isChecked)}
            className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded"
          />
        </div>
        <div className="w-[150px] mr-8"></div>
        <div className="flex-1 mr-8 text-center text-xl">상품 정보</div>
        <div className="w-24 text-center text-xl mr-12">주문 금액</div>
        <div className="mr-4"></div>
        <div className="w-[103px] text-center text-xl">수량</div>
      </div>

      {/* 상품 목록 */}
      <div className="bg-white">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CartSection;
