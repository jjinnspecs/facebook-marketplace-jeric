'use client';

import { Listing } from "@/types/listing";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

export default function ListingCard({ listing }: { listing: Listing }) {
  const imageUrls: string[] = (() => {
    try {
      return JSON.parse(listing.image_url || "[]");
    } catch {
      return [];
    }
  })();

  const listedAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const hasCarousel = imageUrls.length > 1;
  const currentImage = imageUrls[currentIndex] || "/placeholder.png";

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (hasCarousel) {
        setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
      }
    },
    onSwipedRight: () => {
      if (hasCarousel) {
        setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
      }
    },
    trackMouse: true,
  });

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
        {/* Image carousel */}
        <div
          {...swipeHandlers}
          className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100"
        >
          <Image
            src={currentImage}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />

          {hasCarousel && (
            <>
              {/* Prev */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex((prev) =>
                    prev === 0 ? imageUrls.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-gray-700 hover:bg-white transition z-10"
                aria-label="Previous image"
              >
                ‹
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex((prev) =>
                    prev === imageUrls.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-gray-700 hover:bg-white transition z-10"
                aria-label="Next image"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-grow px-3 py-4 space-y-1">
          <p className="text-blue-600 font-bold text-base sm:text-lg">
            ₱{Number(listing.price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <h3 className="font-semibold text-sm sm:text-base truncate">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-700 truncate">{listing.description}</p>
          <p className="text-xs text-gray-500">{listing.location}</p>
          <p className="text-xs text-gray-400 italic">{listedAgo}</p>
        </div>
      </div>
    </Link>
  );
}
