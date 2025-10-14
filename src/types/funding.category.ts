// types/category.ts (새 파일)

export interface SubCategory {
  id: number;
  categoryName: string;
  subCategories: SubCategory[];
}

export interface Category {
  id: number;
  categoryName: string;
  subCategories: SubCategory[];
}

export interface CategoryResponse {
  resultCode: string;
  msg: string;
  data: Category[];
}

// CategoryFilter에서 사용할 간단한 타입
export interface CategoryFilterItem {
  name: string;
  count?: number;
}
