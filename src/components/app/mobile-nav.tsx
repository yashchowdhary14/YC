'use client';

import Link from 'next/link';
import { Home, Clapperboard, User } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around p-2">
      <Link href="/" className="flex flex-col items-center">
        <Home />
      </Link>
      <Link href="/reels" className="flex flex-col items-center">
        <Clapperboard />
      </Link>
      <Link href="/profile" className="flex flex-col items-center">
        <User />
      </Link>
    </div>
  );
}
