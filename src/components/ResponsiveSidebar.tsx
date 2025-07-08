'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Tag, User, ClipboardList } from 'lucide-react';
import CategoryTabs from '@/components/CategoryTabs';

export default function ResponsiveSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger toggle (visible only on small screens) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 fixed top-4 left-4 z-40 bg-white border border-gray-200 rounded-md shadow-md"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar Drawer (mobile) + Sticky sidebar (desktop) */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
        `}
      >
        {/* Close button (mobile only) */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b">
          <h3 className="font-semibold text-gray-700">Menu</h3>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Sidebar Content */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Listing Actions */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              Manage Listings
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/create"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <Tag className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate">Create new listing</span>
              </Link>
              <Link
                href="/my-listings"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <ClipboardList className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate">Your listings</span>
              </Link>
              <Link
                href="/seller-help"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <User className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate">Seller help</span>
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-4">Categories</h3>
            <CategoryTabs vertical />
          </div>
        </div>
      </aside>
    </>
  );
}
