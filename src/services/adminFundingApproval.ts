const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type AdminFundingApprovalResponse = {
  resultCode?: string;
  msg?: string;
  data?: unknown;
};

export type FundingApprovalQuery = {
  page?: number;
  size?: number;
  keyword?: string;
  startDate?: string;
  sort?: 'registeredAt' | 'requestedAt' | string;
  order?: 'ASC' | 'DESC' | string;
};

export type FundingApprovalItem = {
  fundingId: number;
  productName: string;
  requestedAt: string;
  [key: string]: unknown;
};

export type FundingApprovalList = {
  content: FundingApprovalItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export async function fetchFundingApprovalList(
  query: FundingApprovalQuery = {},
  options?: { accessToken?: string },
): Promise<FundingApprovalList> {
  const params = new URLSearchParams();
  if (typeof query.page === 'number') params.set('page', String(Math.max(0, query.page)));
  if (typeof query.size === 'number') params.set('size', String(Math.max(1, query.size)));
  if (query.keyword && query.keyword.trim()) params.set('keyword', query.keyword.trim());
  if (query.startDate) params.set('startDate', query.startDate);
  if (query.sort) params.set('sort', query.sort);
  if (query.order) params.set('order', query.order);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const res = await fetch(
    `${API_BASE}/api/dashboard/admin/fundings/approvals${params.toString() ? `?${params.toString()}` : ''}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers,
    },
  );

  const payload: AdminFundingApprovalResponse & { data?: FundingApprovalList } = await res
    .json()
    .catch(() => ({} as AdminFundingApprovalResponse & { data?: FundingApprovalList }));

  if (!res.ok) {
    const message = payload.msg || '펀딩 승인 대기 목록을 불러오지 못했습니다.';
    throw new Error(message);
  }

  const data = payload.data;
  if (!data || !Array.isArray(data.content)) {
    throw new Error('펀딩 승인 대기 목록 응답이 올바르지 않습니다.');
  }

  return {
    content: data.content.map((item) => ({
      fundingId: Number((item as FundingApprovalItem).fundingId ?? 0),
      productName: String((item as FundingApprovalItem).productName ?? ''),
      requestedAt: String((item as FundingApprovalItem).requestedAt ?? ''),
      ...item,
    })),
    page: Number(data.page ?? 0) || 0,
    size: Number(data.size ?? data.content.length) || data.content.length,
    totalElements: Number(data.totalElements ?? data.content.length) || data.content.length,
    totalPages: Number(data.totalPages ?? 1) || 1,
    hasNext: Boolean(data.hasNext),
    hasPrevious: Boolean(data.hasPrevious),
  };
}

export async function approveFundingApplication(
  applicationId: string | number,
  options?: { accessToken?: string },
): Promise<AdminFundingApprovalResponse> {
  if (!applicationId && applicationId !== 0) {
    throw new Error('승인할 신청 ID가 없습니다.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(
    `${API_BASE}/api/dashboard/admin/artist-applications/${applicationId}/approve`,
    {
      method: 'POST',
      credentials: 'include',
      headers,
    },
  );

  const payload: AdminFundingApprovalResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminFundingApprovalResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '펀딩 승인에 실패했습니다.';
    throw new Error(message);
  }

  return payload;
}



export async function rejectFundingApplication(
  applicationId: string | number,
  rejectionReason: string,
  options?: { accessToken?: string },
): Promise<AdminFundingApprovalResponse> {
  if (!applicationId && applicationId !== 0) {
    throw new Error('거절할 신청 ID가 없습니다.');
  }

  const reason = rejectionReason.trim();
  if (reason.length === 0) {
    throw new Error('거절 사유를 입력해 주세요.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(
    `${API_BASE}/api/dashboard/admin/artist-applications/${applicationId}/reject`,
    {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ rejectionReason: reason }),
    },
  );

  const payload: AdminFundingApprovalResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminFundingApprovalResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '입점 거절에 실패했습니다.';
    throw new Error(message);
  }

  return payload;
}
