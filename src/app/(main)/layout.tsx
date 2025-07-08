import Sidebar from '@/components/ResponsiveSidebar';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <section className="flex-1">{children}</section>
      </div>
    </main>
  );
} 