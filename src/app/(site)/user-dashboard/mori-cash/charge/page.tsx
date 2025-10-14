'use client';

import { useState } from 'react';
import Wallet from '@/assets/wallet.svg';

function CashChargePage() {
  const [currentCash] = useState(5900); // 보유 모리캐시
  const [chargeAmount, setChargeAmount] = useState(4100); // 충전 모리캐시
  const [paymentMethod, setPaymentMethod] = useState<'naver' | 'toss'>('naver');

  const quickAmounts = [5000, 10000, 30000, 50000];

  const handleAddAmount = (amount: number) => {
    setChargeAmount((prev) => prev + amount);
  };

  const handleChargeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setChargeAmount(value ? parseInt(value) : 0);
  };

  const totalCash = currentCash + chargeAmount;

  const handleCharge = () => {
    console.log('충전하기', {
      chargeAmount,
      paymentMethod,
      totalCash,
    });
    // TODO: 충전 API 호출
  };

  return (
    <div>
      <h3 className="mt-15 ml-30 mb-5 text-3xl font-bold">캐시 충전</h3>

      <div className="flex justify-center min-h-screen">
        <div className="relative w-full max-w-[600px]">
          {/* 배경 이미지 */}
          <Wallet
            style={{
              width: '100%',
              height: 'auto',
            }}
            className="w-full"
            aria-hidden
          />

          {/* 오버레이 콘텐츠 */}
          <div className="absolute inset-0 flex flex-col px-12 pt-32">
            {/* 보유 모리캐시 */}
            <div className="flex items-center gap-10 mb-6">
              <span className="text-[20px] font-medium text-gray-700">
                보유 모리캐시
              </span>
              <span className="text-2xl font-bold">
                {currentCash.toLocaleString()} 원
              </span>
            </div>

            {/* 충전 모리캐시 */}
            <div className="flex items-center gap-10 mb-4">
              <span className="text-[20px] font-medium text-gray-700">
                충전 모리캐시
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chargeAmount.toLocaleString()}
                  onChange={handleChargeAmountChange}
                  className="w-32 px-3 py-1 text-right text-2xl font-bold border-2 border-gray-300  focus:outline-none bg-white"
                />
                <span className="text-lg font-medium">원</span>
              </div>
            </div>

            {/* 금액 추가 버튼들 */}
            <div className="flex gap-2 mb-6">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAddAmount(amount)}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                >
                  + {amount}
                </button>
              ))}
            </div>

            {/* 충전 후 모리캐시 */}
            <div className="flex items-center gap-10 mb-6">
              <span className="text-[20px] font-medium text-gray-700">
                충전 후 모리캐시
              </span>
              <span className="text-2xl font-bold text-primary">
                {totalCash.toLocaleString()} 원
              </span>
            </div>

            {/* 충전 방법 */}
            <div className="mb-8">
              <span className="block text-[20px] font-medium text-gray-700 mb-3">
                충전 방법
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="naver"
                    checked={paymentMethod === 'naver'}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as 'naver')
                    }
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-primary flex items-center justify-center peer-checked:bg-white">
                    <div
                      className={`w-3 h-3 rounded-full transition-colors ${
                        paymentMethod === 'naver'
                          ? 'bg-primary'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <span className="text-[16px] font-medium">네이버페이</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="toss"
                    checked={paymentMethod === 'toss'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'toss')}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-primary flex items-center justify-center peer-checked:bg-white">
                    <div
                      className={`w-3 h-3 rounded-full transition-colors ${
                        paymentMethod === 'toss'
                          ? 'bg-primary'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <span className="text-[16px] font-medium">토스페이</span>
                </label>
              </div>
            </div>

            {/* 충전하기 버튼 */}
            <button
              onClick={handleCharge}
              className="w-full max-w-[200px] mx-auto py-3 text-white font-bold bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              충전하기
            </button>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <ul className="mx-auto w-full max-w-[505px] mt-8 space-y-1 text-sm text-gray-600">
        <li>
          ** 캐시 충전 후 7일 이내에 사용하지 않은 경우에 한해, 결제 취소가
          가능합니다.
        </li>
        <li>
          ** 법정대리인의 동의가 없는 미성년자의 결제는 취소될 수 있습니다.
        </li>
        <li>
          ** 캐시를 사용하여 결제한 금액은 현금 환불이 불가하며,
          <br />
          계정 탈퇴 시 잔액은 전액 소멸됩니다.
        </li>
      </ul>
    </div>
  );
}

export default CashChargePage;
