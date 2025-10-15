
export type ApiResponse<T> = {
  resultCode: string;
  msg: string;
  data: T;
};

export type ProductQnaItem = {
  id: number;
  qnaCategory: string;
  qnaTitle: string;
  qnaDescription: string;
  authorName: string;
  createDate: string;
  qnaImages?: string; // JSON 문자열
};

export type ProductQnaListResponse = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  qnaList: ProductQnaItem[];
};

export async function fetchProductQnaList(
  productUuid: string,
  params?: { page?: number; size?: number; qnaCategory?: string },
) {
  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 10),
    ...(params?.qnaCategory ? { qnaCategory: params.qnaCategory } : {}),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/qna/${productUuid}/list?${query}`,
    { credentials: 'include' },
  );

  if (!res.ok) throw new Error('Q&A 목록 조회 실패');
  const data: ApiResponse<ProductQnaListResponse> = await res.json();
  return data.data.qnaList;
}


// Q&A 상세 조회 API
export type ProductQnaDetail = {
  id: number;
  qnaCategory: string;
  qnaTitle: string;
  qnaDescription: string;
  authorName: string;
  createDate: string;
  qnaImages?: {
    url: string;
    type: string;
    s3Key: string;
    originalFileName: string;
  }[];
};

export async function fetchProductQnaDetail(productUuid: string, qnaId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/qna/${productUuid}/${qnaId}`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('Q&A 상세 조회 실패');
  const data: ProductQnaDetail = await res.json();
  return data;
}