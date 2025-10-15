'use client';

import { useState, useEffect } from 'react';

// --- API 연동을 위한 설정 ---
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '');

// 한 페이지에 표시할 아이템 수
const ITEMS_PER_PAGE = 8;

// --- TypeScript 타입 정의 ---
// API 응답의 content 배열에 포함될 개별 내역 객체의 타입
interface CashHistory {
  txId: string;
  occurredAt: string;
  category: string;
  chargeAmount: number;
  useAmount: number;
  balanceAfter: number;
  paymentMethod: string;
  status: string;
}

export default function CashHistoryPage() {
  // --- 상태 관리 ---
  const [history, setHistory] = useState<CashHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 데이터 패칭 로직 ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: (currentPage - 1).toString(), // API는 0-based index
          size: ITEMS_PER_PAGE.toString(),
          sort: 'occurredAt', // 기본 정렬 기준 (최신순)
          order: 'DESC',
        });

        const response = await fetch(
          `${API_BASE_URL}/api/dashboard/cash/history?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json;charset=UTF-8',
            },
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('내역을 불러오는 데 실패했습니다.');
        }

        const result = await response.json();

        if (result.resultCode === '200') {
          setHistory(result.data.content);
          setTotalPages(result.data.totalPages);
        } else {
          throw new Error(result.msg || '알 수 없는 오류가 발생했습니다.');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('데이터를 불러오는 중 문제가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 다시 가져옵니다.

  const renderTableBody = () => {
    if (loading) {
      return (
        <div className="text-center py-10 col-span-6">
          목록을 불러오는 중입니다...
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-500 py-10 col-span-6">
          오류: {error}
        </div>
      );
    }
    if (history.length === 0) {
      return (
        <div className="text-center py-10 col-span-6">
          충전 내역이 없습니다.
        </div>
      );
    }
    return (
      <>
        {history.map((item) => (
          <div
            key={item.txId}
            className="grid grid-cols-6 gap-4 py-5 px-6 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center text-sm">
              {new Date(item.occurredAt).toLocaleDateString('ko-KR')}
            </div>
            <div className="text-center text-sm">{item.category}</div>
            <div className="text-center text-sm">
              {item.chargeAmount > 0
                ? `${item.chargeAmount.toLocaleString()}원`
                : '-'}
            </div>
            <div className="text-center text-sm">
              {item.useAmount > 0
                ? `${item.useAmount.toLocaleString()}원`
                : '-'}
            </div>
            <div className="text-center font-medium text-primary text-sm">
              {item.balanceAfter.toLocaleString()}원
            </div>
            <div className="text-center text-sm">{item.paymentMethod}</div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-8">충전 내역</h1>

      {/* 테이블 */}
      <div className="border-t-2 border-gray-900">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-6 gap-4 py-4 px-6 bg-white border-b border-gray-200">
          <div className="text-center font-medium text-gray-700">충전일</div>
          <div className="text-center font-medium text-gray-700">구분</div>
          <div className="text-center font-medium text-gray-700">충전 금액</div>
          <div className="text-center font-medium text-gray-700">사용 금액</div>
          <div className="text-center font-medium text-gray-700">잔액</div>
          <div className="text-center font-medium text-gray-700">결제수단</div>
        </div>

        {/* 테이블 바디 */}
        {renderTableBody()}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                className={`w-8 h-8 rounded transition-colors ${
                  currentPage === page
                    ? 'text-gray-900 font-bold'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || loading}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
