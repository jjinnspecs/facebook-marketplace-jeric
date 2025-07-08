'use client';

import Link from 'next/link';
import React from 'react';

const listingTypes = [
  {
    title: 'Item for sale',
    description: 'Lorem ipsum dolor sit',
    href: '/create/item',
  },
  {
    title: 'Create multiple listings',
    description: 'Lorem ipsum dolor sit',
    href: '/create/multiple',
  },
  {
    title: 'Vehicle for sale',
    description: 'Lorem ipsum dolor sit',
    href: '/create/vehicle',
  },
  {
    title: 'Home for sale or rent',
    description: 'Lorem ipsum dolor sit',
    href: '/create/home',
  },
];

interface ListingTypeSelectorProps {
  category?: string;
}

export default function ListingTypeSelector({ category }: ListingTypeSelectorProps) {
  return (
    <section className="flex-1">
      <div className="bg-gray-50 w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
            Choose listing type
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listingTypes.map((listingType) => (
              <Link
                href={`${listingType.href}${
                  category ? `?category=${category}` : ''
                }`}
                key={listingType.title}
              >
                <div className="group block bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out h-full cursor-pointer">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 transition-transform duration-300 ease-in-out group-hover:scale-105" />
                  <h2 className="font-bold text-gray-800 text-base mb-1">
                    {listingType.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {listingType.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 