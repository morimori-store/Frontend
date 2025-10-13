// app/artist/(dashboard)/orders/adapters.ts

import type { ArtistOrder } from '@/types/artistDashboard';

export type OrderRow = {
  id: string;         // 주문번호
  statusText: string; // 상품명 요약
  buyer: string;      // "이름 / 닉네임(or id)"
  orderState: string; // 상태 한글(= statusText)
  requestAt: string;  // YYYY-MM-DD
};

const toDateOnly = (isoOrDate?: string): string => {
  if (!isoOrDate) return '-';
  // 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss' 모두 커버
  const d = isoOrDate.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '-';
};

export function toRow(item: ArtistOrder): OrderRow {
  const buyerRight =
    (item.buyer?.nickname && String(item.buyer.nickname)) ||
    (item.buyer?.id !== undefined ? String(item.buyer.id) : '');

  const product =
    item.itemCount && item.itemCount > 1
      ? `${item.productSummary} 외 ${item.itemCount - 1}개`
      : item.productSummary || '-';

  return {
    id: item.orderNumber || item.orderId || '-',
    statusText: product,
    buyer: `${item.buyer?.name ?? '-'} / ${buyerRight || '-'}`,
    orderState: item.statusText || item.status || '-',
    requestAt: toDateOnly(item.orderDate),
  };
}
