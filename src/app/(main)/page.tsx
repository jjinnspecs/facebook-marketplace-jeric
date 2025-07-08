'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types/listing';
import ListingCard from '@/components/ListingCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    setSearchTerm(search);
  };

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);

    query.then(({ data }) => {
      setListings(data || []);
      setLoading(false);
    });
  }, [searchTerm]);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 capitalize text-center mb-4">
          Today&apos;s Picks
        </h2>
        <div className="flex justify-center">
          <div className="flex w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 flex items-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No listings found.
        </div>
      )}
    </>
  );
} 