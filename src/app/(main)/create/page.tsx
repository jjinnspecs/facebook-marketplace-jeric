'use client';

import Link from 'next/link';
import React from 'react';
import { Tag, Car, Home, PackagePlus } from 'lucide-react';

const listingTypes = [
  {
    title: 'Item for sale',
    description: 'Sell a single item, like electronics, clothes, or furniture.',
    href: '/create/item',
    icon: PackagePlus,
  },
  {
    title: 'Vehicle for sale',
    description: 'List a car, motorcycle, or other vehicle.',
    href: '/create/vehicle',
    icon: Car,
  },
  {
    title: 'Home for sale or rent',
    description: 'Create a listing for real estate properties.',
    href: '/create/home',
    icon: Home,
  },
  {
    title: 'Multiple items/Bulk',
    description: 'Sell multiple similar items or a bulk quantity.',
    href: '/create/multiple',
    icon: Tag,
  },
];

export default function ChooseListingTypePage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-8 text-center">
        Choose Listing Type
      </h1>
      <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
        Select the type of listing you want to create to get started. Each type has specific fields to help you describe your item accurately.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listingTypes.map((listingType) => (
          <Link key={listingType.title} href={listingType.href} className="flex flex-col h-full">
            <div className="group block bg-card text-card-foreground rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out h-full cursor-pointer flex-col justify-between">
              <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full mx-auto mb-4 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-105">
                <listingType.icon className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-lg mb-1">
                {listingType.title}
              </h2>
              <p className="text-sm text-muted-foreground">{listingType.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}