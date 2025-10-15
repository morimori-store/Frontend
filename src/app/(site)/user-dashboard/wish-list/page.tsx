'use client';

import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';

// --- API 연동을 위한 설정 ---

// API 기본 URL (환경 변수가 없으면 localhost를 사용)
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '');

// 한 페이지에 표시할 상품 수
const ITEMS_PER_PAGE = 8; // 그리드가 4열이므로 8개 또는 12개 등이 적합합니다.

// --- API 응답 데이터에 대한 TypeScript 타입 정의 ---
interface Artist {
  id: string;
  name: string;
}

interface WishlistItem {
  wishId: string;
  productId: number;
  productName: string;
  price: number;
  artist: Artist;
  imageUrl: string;
}

export default function WishList() {
  // --- 상태 관리 ---
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 좋아요 상태 관리는 유지 (필요 시 API 연동 추가)
  const [likedItems, setLikedItems] = useState<number[]>([]);

  // --- 데이터 패칭 로직 ---
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);

      try {
        // API 요청에 사용할 쿼리 파라미터 생성
        const params = new URLSearchParams({
          page: (currentPage - 1).toString(), // API는 0-based index를 사용하므로 1을 빼줍니다.
          size: ITEMS_PER_PAGE.toString(),
        });

        const response = await fetch(
          `${API_BASE_URL}/api/dashboard/wishlist?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json;charset=UTF-8',
            },
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('찜한 상품 목록을 불러오는 데 실패했습니다.');
        }

        const result = await response.json();

        console.log(result);
        if (result.resultCode === '200') {
          setWishlistItems(result.data.content);
          setTotalPages(result.data.totalPages);
          // 초기 좋아요 상태 설정 (API 응답 기반)
          const initialLikedIds = result.data.content.map(
            (item: WishlistItem) => item.productId,
          );
          setLikedItems(initialLikedIds);
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

    fetchWishlist();
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 다시 가져옵니다.

  // const toggleLike = (id: number) => {
  //   // 이 부분은 향후 '찜하기/취소' API 연동 시 수정이 필요합니다.
  //   if (likedItems.includes(id)) {
  //     setLikedItems(likedItems.filter((item) => item !== id));
  //   } else {
  //     setLikedItems([...likedItems, id]);
  //   }
  // };

  // --- 렌더링 함수 ---
  const renderProductGrid = () => {
    if (loading) {
      return (
        <div className="text-center py-10">목록을 불러오는 중입니다...</div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-500 py-10">오류: {error}</div>
      );
    }
    if (wishlistItems.length === 0) {
      return <div className="text-center py-10">찜한 상품이 없습니다.</div>;
    }
    return (
      <div className="mx-auto w-1/2 grid grid-cols-4 gap-6 mb-12">
        {wishlistItems.map((product) => (
          <div className="aspect-[235/335]" key={product.wishId}>
            <ProductCard
              img={product.imageUrl}
              title={product.productName}
              brand={product.artist.name}
              price={product.price.toLocaleString('ko-KR')} // 숫자를 원화 형식으로 변환
              // API 응답에 할인율, 원래 가격, 평점 정보가 없으므로 props에서 제외하거나
              // ProductCard 컴포넌트에서 optional로 처리해야 합니다.
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-12 bg-white min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-8">찜한 상품 목록</h1>

      {/* 상품 그리드 */}
      {renderProductGrid()}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
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
                className={`w-8 h-8 rounded ${
                  currentPage === page
                    ? 'text-primary font-bold underline'
                    : 'text-gray-700 hover:bg-gray-100'
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
