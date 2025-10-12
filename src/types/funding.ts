//======= 펀딩 불러오기 관련 타입 ==========

// 요청 파라미터 타입
export type FundingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'OPEN'
  | 'CLOSED'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELED';

export type SortBy = 'popular' | 'recent' | 'deadline' | 'highAmount';

export interface FundingListProps {
  status?: FundingStatus[];
  sortBy?: SortBy;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

// 응답 타입
export interface FundingItem {
  id: number;
  title: string;
  imageUrl: string;
  categoryName: string;
  authorName: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  remainingDays: number;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface FundingListData {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: FundingItem[];
  number: number;
  sort: Sort;
  pageable: Pageable;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  resultCode: string;
  msg: string;
  data: T;
}

export type FundingListResponse = ApiResponse<FundingListData>;

// ===== 펀딩 생성 관련 타입 =====

// 펀딩 옵션 (요청용)
export interface CreateFundingOptionRequest {
  name: string;
  price: number;
  stock: number;
  sortOrder: number;
}

// 펀딩 옵션 (응답용)
export interface FundingOptionResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  sortOrder: number;
}

// 펀딩 생성 요청
export interface CreateFundingRequest {
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  targetAmount: number;
  startDate: string; // ISO 8601 형식
  endDate: string; // ISO 8601 형식
  options: CreateFundingOptionRequest[];
}

// 펀딩 생성 응답 데이터
export interface CreateFundingData {
  fundingId: number;
  title: string;
  description: string;
  categoryName: string;
  imageUrl: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  options: FundingOptionResponse[];
}

// 펀딩 생성 응답
export interface CreateFundingResponse {
  resultCode: string;
  msg: string;
  data: CreateFundingData;
}
