import 'server-only';
import type {
  ApiResponse,
  ProductListData,
  ProductListParams,
} from '@/types/product';
import { pickProductImageUrl } from '@/utils/productImage';


export type ProductKind =
  | 'all'
  | 'upcoming'
  | 'restock'
  | 'planned'
  | 'onsale'
  | 'new'
  | 'low-stock';

function resolveProductPath(kind: ProductKind) {
  switch (kind) {
    case 'all':
      return '/api/products';
    case 'upcoming':
      return '/api/products/upcoming';
    case 'restock':
      return '/api/products/restock';
    case 'planned':
      return '/api/products/planned';
    case 'onsale':
      return '/api/products/onsale';
    case 'new':
      return '/api/products/new';
    case 'low-stock':
      return '/api/products/low-stock';
  }
}

function buildAllListQuery(params?: ProductListParams) {
  if (!params) return '';
  const sp = new URLSearchParams();

  const set = (k: string, v?: string | number | boolean | null) => {
    if (v === undefined || v === null) return;
    sp.set(k, String(v));
  };

  set('categoryId', params.categoryId);
  set('minPrice', params.minPrice);
  set('maxPrice', params.maxPrice);
  set('deliveryType', params.deliveryType);
  set('sort', params.sort ?? 'newest');
  set('page', (params.page ?? 0) + 1); // UI 0-base → 서버 1-base
  set('size', params.size ?? 12);
  (params.tagIds ?? []).forEach((id) => sp.append('tagIds', String(id)));

  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

async function safeParseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function normalizeProductsPaged(
  input: unknown,
  fallbackSize: number,
): ProductListData {
  const empty: ProductListData = {
    page: 0,
    size: fallbackSize,
    totalElements: 0,
    totalPages: 0,
    products: [],
  };
  if (input == null) return empty;

  // 케이스 A) 정식 페이지형 응답
  const asApi = input as ApiResponse<{
    page: number; // 1-base
    size: number;
    totalElements: number;
    totalPages: number;
    products: Array<{
      productUuid: string;
      url: string;
      thumbnailUrl?: string | null;
      primaryImageUrl?: string | null;
      brandName: string;
      name: string;
      price: number;
      discountRate: number;
      discountPrice: number;
      rating: number | null;
    }>;
  }>;
  if (asApi && typeof asApi === 'object' && 'data' in asApi) {
    const d = asApi.data;
    if (d && Array.isArray(d.products)) {
      const mapped = d.products.map((p) => ({
       productUuid: p.productUuid,
          url: pickProductImageUrl(p as Record<string, unknown>),
          brandName: p.brandName,
          name: p.name,
          price: p.price,
          discountRate: p.discountRate,
          discountPrice: p.discountPrice,
          rating: p.rating ?? null,
      }));
      console.log('[products.server] raw paged item', d.products[0]);
      return {
        page: Math.max(0, (d.page ?? 1) - 1),
        size: d.size ?? fallbackSize,
        totalElements: d.totalElements ?? 0,
        totalPages: d.totalPages ?? 0,
        products: mapped,
      };
    }
  }

  // 케이스 B) 프리셋 배열형 응답
  const asArrayEnvelope = input as { data?: unknown };
  if (asArrayEnvelope && Array.isArray(asArrayEnvelope.data)) {
    const list = asArrayEnvelope.data.map((p) => ({
      productUuid: String((p as { productUuid?: unknown }).productUuid ?? ''),
      url: pickProductImageUrl(p as Record<string, unknown>),
      brandName: String((p as { brandName?: unknown }).brandName ?? ''),
      name: String((p as { name?: unknown }).name ?? ''),
      price: Number((p as { price?: unknown }).price ?? 0),
      discountRate: Number((p as { discountRate?: unknown }).discountRate ?? 0),
      discountPrice: Number((p as { discountPrice?: unknown }).discountPrice ?? 0),
      rating: (p as { rating?: unknown }).rating == null ? null : Number((p as { rating?: unknown }).rating),
    }));
    console.log('[products.server] raw preset item', asArrayEnvelope.data[0]);
    const total = list.length;
    return {
      page: 0,
      size: Math.max(fallbackSize, total),
      totalElements: total,
      totalPages: total ? 1 : 0,
      products: list,
    };
  }

  return empty;
}

// 서버 전용: 상품 목록 조회
export async function fetchProductListServer(
  kind: ProductKind,
  params?: ProductListParams,
): Promise<ProductListData> {
 
  const base =
    (process.env.NEXT_PUBLIC_API_BASE_URL ?? '') + resolveProductPath(kind);
  const url = kind === 'all' ? base + buildAllListQuery(params) : base;

  try {
     
    const res = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      cache: 'no-store',
      credentials: 'include',
    });

    const parsed = await safeParseJson<unknown>(res);
    if (res.status === 404)
      return normalizeProductsPaged(parsed, params?.size ?? 12);
    if (!res.ok) {
      console.error('[fetchProductListServer] FAIL', {
        url,
        status: res.status,
        parsed,
      });
      return normalizeProductsPaged(parsed, params?.size ?? 12);
    }
    return normalizeProductsPaged(parsed, params?.size ?? 12);
  } catch (e) {
    console.error('[fetchProductListServer] EXCEPTION', e);
    return {
      page: 0,
      size: params?.size ?? 12,
      totalElements: 0,
      totalPages: 0,
      products: [],
    };
  }
}
