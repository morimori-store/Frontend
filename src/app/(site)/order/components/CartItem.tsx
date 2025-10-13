'use client';

import React from 'react';
import { useOrderStore } from '@/app/(site)/order/stores/orderStore';

interface CartItemProps {
  item: {
    id: number;
    brand: string;
    name: string;
    option: string;
    price: number;
    quantity: number;
    image: string;
    isChecked: boolean;
    isRegular: boolean;
  };
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItem, removeCartItem, toggleCartItem } = useOrderStore();

  const handleQuantityUpdate = (change: number) => {
    updateCartItem(item.id, {
      quantity: Math.max(0, item.quantity + change),
    });
  };

  return (
    <div className="border-b border-gray-300 bg-white">
      <div className="flex items-center py-6 px-4">
        {/* 체크박스 */}
        <div className="mr-6">
          <input
            type="checkbox"
            checked={item.isChecked}
            onChange={() => toggleCartItem(item.id)}
            className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded"
          />
        </div>

        {/* 상품 이미지 */}
        <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg mr-8 overflow-hidden">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            상품 이미지
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 mr-8">
          <p className="text-gray-500 text-sm mb-1">{item.brand}</p>
          <h3 className="text-gray-500 font-semibold text-base leading-tight mb-2">
            {item.name}
          </h3>
          <p className="text-gray-500 text-sm">옵션 : {item.option}</p>
        </div>

        {/* 가격 */}
        <div className="w-24 text-center mr-12">
          <div className="text-2xl font-bold text-gray-800">
            {item.price.toLocaleString()}원
          </div>
        </div>

        {/* 삭제 버튼 */}
        <div className="mr-4">
          <button
            onClick={() => removeCartItem(item.id)}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 text-xl"
          >
            ×
          </button>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center border border-gray-300 rounded w-[103px]">
          <button
            onClick={() => handleQuantityUpdate(-1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            -
          </button>
          <span className="flex-1 text-center py-2">{item.quantity}</span>
          <button
            onClick={() => handleQuantityUpdate(1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
