
export type ProductImageCarrier = Record<string, unknown>;

const FRONTEND_ORIGIN = (() => {
  const base = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;
  if (!base) return null;
  try {
    return new URL(base).origin;
  } catch {
    return null;
  }
})();

const stringFrom = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed.length) return null;

  if (FRONTEND_ORIGIN && trimmed.startsWith('http')) {
    try {
      const url = new URL(trimmed, FRONTEND_ORIGIN);
      if (url.origin === FRONTEND_ORIGIN) {
        const relative = `${url.pathname}${url.search}${url.hash}`;
        return relative || '/';
      }
      return url.toString();
    } catch {
      return trimmed;
    }
  }

  return trimmed;
};

const pickFromImagesArray = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null;
  const images = value as Array<
    | { url?: string | null; fileUrl?: string | null; type?: string | null; fileType?: string | null }
    | Record<string, unknown>
  >;
  const main =
    images.find((img) => {
      const type = (img as { type?: string | null }).type ?? (img as { fileType?: string | null }).fileType;
      return type === 'MAIN';
    }) ?? images[0];
  if (!main) return null;
  return (
    stringFrom((main as { url?: string | null }).url) ??
    stringFrom((main as { fileUrl?: string | null }).fileUrl) ??
    null
  );
};

export const pickProductImageUrl = (item: ProductImageCarrier): string => {
  const candidates = [
    'thumbnailUrl',
    'primaryImageUrl',
    'productImageUrl',
    'imageUrl',
    'mainImageUrl',
    'thumbnailImageUrl',
    'url',
  ];
  for (const key of candidates) {
    const value = stringFrom(item[key]);
    if (value) return value;
  }

  const fallback =
    pickFromImagesArray((item as { images?: unknown }).images) ??
    pickFromImagesArray((item as { productImages?: unknown }).productImages) ??
    (() => {
      const list = (item as { imageUrls?: unknown }).imageUrls;
      if (!Array.isArray(list)) return null;
      const first = list.find((v) => typeof v === 'string' && v.trim().length > 0);
      return first ? stringFrom(first) : null;
    })();

  return fallback ?? '';
};
