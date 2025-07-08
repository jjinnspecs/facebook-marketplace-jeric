'use client';

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => (prev + 1) % images.length),
    onSwipedRight: () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length),
    trackMouse: true,
  });

  const currentImage = images[currentIndex] || "/placeholder.png";

  return (
    <>
      <div
        {...(images.length > 1 ? swipeHandlers : {})}
        className="relative w-full aspect-video bg-gray-100 rounded overflow-hidden"
      >
        <Image
          src={currentImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full text-gray-700 hover:bg-white transition z-10"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full text-gray-700 hover:bg-white transition z-10"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
          {images.map((src, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 rounded cursor-pointer transition overflow-hidden ${
                index === currentIndex ? 'border-2 border-blue-500' : 'border border-gray-200'
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
