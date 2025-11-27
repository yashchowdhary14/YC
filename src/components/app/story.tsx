'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

export default function Story({ user, isYou = false }) {
  return (
<<<<<<< HEAD
    <div className="flex flex-col items-center space-y-1 cursor-pointer group">
      <div className="relative transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5 opacity-100 animate-pulse-slow"></div>
        <Avatar className="w-16 h-16 border-2 border-background p-0.5 relative z-10">
=======
    <div className="flex flex-col items-center space-y-1">
      <div className="relative">
        <Avatar className="w-16 h-16 border-2 border-pink-500 p-0.5">
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
        </Avatar>
        {isYou && (
<<<<<<< HEAD
          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-background z-20 transition-transform group-hover:scale-110">
            <Plus className="text-white w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-xs text-center truncate w-16 group-hover:text-primary transition-colors">{user.username}</p>
=======
          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full">
            <Plus className="text-white w-5 h-5" />
          </div>
        )}
      </div>
      <p className="text-xs text-center">{user.username}</p>
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    </div>
  );
}
