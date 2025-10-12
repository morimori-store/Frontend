// app/funding/[id]/_components/ProductImages.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt="Product main image"
          className="w-full h-full object-cover"
          width={645}
          height={450}
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex items-center justify-center space-x-2">
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border"
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

        {/* Thumbnail Images */}
        <div
          className="flex space-x-2 justify-center"
          style={{ width: '460px' }}
        >
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => goToImage(index)}
            >
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                width={111}
                height={62}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border"
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
