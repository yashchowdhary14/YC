'use client';

import MobileNav from '@/components/app/mobile-nav';

export default function ReelsPage() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 bg-black text-white p-4">
        <h1 className="text-2xl font-bold">Reels</h1>
        <p className="text-center mt-10">Reels content will be here.</p>
      </main>
      <MobileNav />
    </div>
  );
}
