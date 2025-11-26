'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

export default function Story({ user, isYou = false }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative">
        <Avatar className="w-16 h-16 border-2 border-pink-500 p-0.5">
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
        </Avatar>
        {isYou && (
          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full">
            <Plus className="text-white w-5 h-5" />
          </div>
        )}
      </div>
      <p className="text-xs text-center">{user.username}</p>
    </div>
  );
}
