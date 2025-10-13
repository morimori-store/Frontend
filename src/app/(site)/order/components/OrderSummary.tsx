'use client';

import React from 'react';
import { useOrderStore } from '@/app/(site)/order/stores/orderStore';

const OrderSummary = () => {
  const { cartItems } = useOrderStore();

  const calculateTotal = () => {
    const checkedItems = cartItems.filter((item) => item.isChecked);
    const totalPrice = checkedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingFee = totalPrice > 0 ? 3000 : 0;
    return {
      totalPrice,
      shippingFee,
      finalPrice: totalPrice + shippingFee,
      checkedCount: checkedItems.length,
    };
  };

  const { totalPrice, shippingFee, finalPrice, checkedCount } =
    calculateTotal();

  return (
    <>
      {/* 주문 요약 */}
      <section className="mb-8">
        <div className="flex justify-center gap-16 text-2xl">
          <div className="text-center">
            <div className="font-semibold mb-2">총 주문금액</div>
            <div>{totalPrice.toLocaleString()}원</div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-2">총 배송비</div>
            <div>{shippingFee.toLocaleString()}원</div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-2">총 결제금액</div>
            <div>{finalPrice.toLocaleString()}원</div>
          </div>
        </div>
      </section>

      {/* 주문 버튼 */}
      <section className="flex justify-center gap-4">
        <button className="px-8 py-3 border border-primary text-primary rounded bg-white font-semibold">
          선택주문({checkedCount})
        </button>
        <button className="px-8 py-3 bg-primary text-white rounded font-semibold">
          전체주문
        </button>
      </section>
    </>
  );
};

export default OrderSummary;
