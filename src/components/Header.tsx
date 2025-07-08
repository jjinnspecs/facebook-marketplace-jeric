import React from 'react';
import Link from 'next/link';
import { Bell, MessageSquareText, User } from 'lucide-react'; // You can swap icons if needed

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="p-4 max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Marketplace</h1>
        </Link>

        {/* Right-side buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/notifications"
            className="hover:bg-gray-100 p-2 rounded-full transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </Link>

          <Link
            href="/messages"
            className="hover:bg-gray-100 p-2 rounded-full transition"
            title="Messages"
          >
            <MessageSquareText className="w-5 h-5 text-gray-600" />
          </Link>

          <Link
            href="/profile"
            className="hover:bg-gray-100 p-2 rounded-full transition"
            title="Profile"
          >
            <User className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </div>
    </header>
  );
}
