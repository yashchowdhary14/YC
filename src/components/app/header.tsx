'use client';

import { Plus, Heart } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-serif">Instagram</h1>
      <div className="flex items-center space-x-4">
        <Plus />
        <Heart />
      </div>
    </header>
  );
}
