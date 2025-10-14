'use client';

import { AuthorCard } from '@/components/user-dashboard/AuthorCard';
import { useState, useEffect } from 'react';

// --- API 연동을 위한 설정 ---
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '');

// 한 페이지에 표시할 작가 수
const ITEMS_PER_PAGE = 8;

// --- TypeScript 타입 정의 ---
// AuthorCard에 전달될 작가 정보 타입
interface Author {
  id: string;
  name: string;
  profileImage?: string | null; // API 응답에 맞춰 null 허용
  pageUrl: string;
}

// API 응답의 content 배열에 포함될 아이템 타입 (작가 정보)
interface ApiResponseItem {
  artistId: string;
  artistName: string;
  profileImageUrl: string | null;
  artistPageUrl: string;
}

export default function FollowingAuthors() {
  // --- 상태 관리 ---
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 데이터 패칭 로직 ---
  useEffect(() => {
    const fetchFollowingArtists = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: (currentPage - 1).toString(), // API는 0-based index
          size: ITEMS_PER_PAGE.toString(),
        });

        const response = await fetch(
          `${API_BASE_URL}/api/dashboard/following-artists?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json;charset=UTF-8',
            },
            credentials: 'include', // 인증 정보를 포함하여 요청
          },
        );

        if (!response.ok) {
          throw new Error('팔로우하는 작가 목록을 불러오는 데 실패했습니다.');
        }

        const result = await response.json();

        if (result.resultCode === '200') {
          // API가 직접 작가 목록을 반환하므로, 바로 상태에 매핑합니다.
          const fetchedAuthors = result.data.content.map(
            (item: ApiResponseItem) => ({
              id: item.artistId,
              name: item.artistName,
              profileImage: item.profileImageUrl,
              pageUrl: item.artistPageUrl,
            }),
          );

          setAuthors(fetchedAuthors);
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

    fetchFollowingArtists();
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 다시 가져옵니다.

  const handleFollow = (id: string | number) => {
    // TODO: 실제 팔로우/언팔로우 API 연동 필요
    console.log('팔로잉 토글:', id);
    // 예시: 언팔로우 시 목록에서 즉시 제거
    setAuthors(authors.filter((author) => author.id !== id));
  };

  // --- 렌더링 함수 ---
  const renderAuthorGrid = () => {
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
    if (authors.length === 0) {
      return (
        <div className="text-center py-10">팔로우하는 작가가 없습니다.</div>
      );
    }
    return (
      <div className="mx-auto w-1/2 grid grid-cols-4 gap-6 mb-12">
        {authors.map((author) => (
          <AuthorCard
            key={author.id}
            id={+author.id}
            name={author.name}
            profileImage={author.profileImage || undefined} // null일 경우 undefined로 전달
            onFollow={handleFollow}
            path={author.pageUrl}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-12 bg-white min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-8">팔로우하는 작가</h1>

      {/* 작가 그리드 */}
      {renderAuthorGrid()}

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
                    ? 'text-green-600 font-bold underline'
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
