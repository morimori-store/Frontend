'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

import type { ProductImageResponse, UploadedImageInfo } from '@/types/product';
import { toAbsoluteImageUrl } from '@/utils/image';

type ProductImageLike = ProductImageResponse | UploadedImageInfo;

type Props = {
  images?: ProductImageLike[];
};

const allowedTypes = new Set(['MAIN', 'THUMBNAIL', 'ADDITIONAL']);

const resolveSrc = (img: ProductImageLike): string | null => {
  return (
    toAbsoluteImageUrl(img.url ?? img.fileUrl ?? '') ??
    toAbsoluteImageUrl(img.fileUrl ?? '') ??
    null
  );
};

export default function ProductImages({ images }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const candidates = useMemo(() => {
    return (
      images
        ?.filter((img) => allowedTypes.has((img.type ?? img.fileType) ?? ''))
        .map((img) => ({
          ...img,
          displayUrl: resolveSrc(img),
        }))
        .filter((img) => !!img.displayUrl) ?? []
    );
  }, [images]);

  if (!candidates.length) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-[450px]">
          <span className="text-gray-500">표시할 이미지가 없습니다.</span>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? candidates.length - 1 : prev - 1,
    );
  };
  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === candidates.length - 1 ? 0 : prev + 1,
    );
  };
  const goToImage = (index: number) => setCurrentImageIndex(index);

  const mainImage = candidates[currentImageIndex];

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[550px] bg-gray-200 rounded-lg overflow-hidden">
        {mainImage?.displayUrl ? (
          <Image
            src={mainImage.displayUrl}
            alt={mainImage.originalFileName ?? '상품 이미지'}
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center w-[645px] h-[645px]">
            <span className="text-gray-500">이미지를 불러올 수 없습니다.</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={goToPrevious}
          className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={candidates.length <= 1}
          aria-label="이전 이미지"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex space-x-2 justify-center w-[460px]">
          {candidates.slice(0, 4).map((image, index) => (
            <div
              key={`${image.displayUrl}-${index}`}
              className={`relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all w-[111px] h-[111px] ${
                index === currentImageIndex
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => goToImage(index)}
            >
              {image.displayUrl ? (
                <Image
                  src={image.displayUrl}
                  alt={`상품 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={goToNext}
          className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={candidates.length <= 1}
          aria-label="다음 이미지"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
