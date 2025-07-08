'use client';

import { categories } from "@/lib/categories";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  vertical?: boolean;
};

export default function CategoryTabs({ vertical = false }: Props) {
  const pathname = usePathname();

  return (
    <nav className={`${vertical ? "flex flex-col gap-1" : "flex flex-wrap gap-2 mb-4"}`}>
      {categories.map((cat) => {
        const isAllListingsCategory = ["Today's Picks"].includes(cat);
        const href = isAllListingsCategory ? '/' : `/category/${cat}`;
        
        // Check if the current path matches the link's href to determine if it's selected.
        // For dynamic routes, this works because the href is constructed with the category name.
        const isSelected = pathname === href;

        return (
          <Link
            href={href}
            key={cat}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 w-full ${
              isSelected
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </nav>
  );
}
