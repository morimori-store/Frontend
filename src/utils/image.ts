
export function toAbsoluteImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url; // 이미 절대경로면 그대로 사용

  // NEXT_PUBLIC_API_BASE_URL 환경변수 사용
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.mori-mori.store';
  return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}
