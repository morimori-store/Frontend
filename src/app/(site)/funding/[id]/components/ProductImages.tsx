'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FundingImage } from '@/types/funding';

interface ProductImagesProps {
  images?: FundingImage[];
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ height: '450px' }}
        >
          <span className="text-gray-500">이미지가 없습니다.</span>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const mainImage = images[currentImageIndex];

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.fileUrl}
            alt="Product main image"
            className="w-full h-full object-cover"
            width={645}
            height={450}
            priority
          />
        ) : (
          <div
            style={{ width: '645px', height: '450px' }}
            className="flex items-center justify-center"
          >
            <span className="text-gray-500">이미지를 불러올 수 없습니다.</span>
          </div>
        )}
      </div>

      {/* 썸네일 갤러리 */}
      <div className="flex items-center justify-center space-x-2">
        {/* 왼쪽 화살표 */}
        <button
          onClick={goToPrevious}
          className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={images.length <= 1}
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

        {/* 썸네일 이미지들 */}
        <div
          className="flex space-x-2 justify-center"
          style={{ width: '460px' }}
        >
          {images.slice(0, 4).map((image, index) => (
            <div
              key={image.fileUrl || index}
              style={{ width: '111px', height: '62px' }}
              className={`bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => goToImage(index)}
            >
              {image ? (
                <Image
                  src={image.fileUrl}
                  alt={`Product image ${index + 1}`}
                  width={111}
                  height={62}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        {/* 오른쪽 화살표 */}
        <button
          onClick={goToNext}
          className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={images.length <= 1}
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
