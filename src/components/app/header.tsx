'use client';

import { Heart } from 'lucide-react';
import { CreateButton } from '../create';

export default function AppHeader() {
  const handleCreateClick = () => {
    // TODO: In the next step, this will open the CreateModal.
    console.log('Create button clicked');
  };

  return (
    <header className="bg-background text-foreground p-4 flex justify-between items-center border-b">
      <h1 className="text-2xl font-serif font-instagram">YCP</h1>
      <div className="flex items-center space-x-4">
        <CreateButton onClick={handleCreateClick} />
        <Heart />
      </div>
    </header>
  );
}
