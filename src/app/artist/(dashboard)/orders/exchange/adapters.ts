// app/artist/(dashboard)/orders/exchange/adapters.ts

import type { ArtistExchangeRequest } from '@/types/artistDashboard';

export type ExchangeRow = {
  id: string;          // 주문번호
  statusText: string;  // 상품명
  buyer: string;       // "닉네임 / id"
  requestState: string;// 상태(한글)
  requestAt: string;   // YYYY-MM-DD
};

// 날짜 변환 유틸
const toDateOnly = (isoOrDate?: string): string => {
  if (!isoOrDate) return '-';
  const d = isoOrDate.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '-';
};

export function toRow(item: ArtistExchangeRequest): ExchangeRow {
  return {
    id: item.orderNumber || item.orderId || '-',
    statusText: item.orderItem?.productName || '-',
    buyer: `${item.customer?.nickname ?? '-'} / ${
      item.customer?.id !== undefined ? String(item.customer.id) : '-'
    }`,
    requestState: item.statusText || item.status || '-',
    requestAt: toDateOnly(item.requestDate),
  };
}
