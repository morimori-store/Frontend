import { CategoryResponse } from '@/types/funding.category';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '');

export async function fetchCategories(): Promise<CategoryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('카테고리 조회 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('카테고리 조회 에러:', error);
    throw error;
  }
}
