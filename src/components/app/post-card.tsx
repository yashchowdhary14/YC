'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';

export default function PostCard({ post }) {
  return (
    <div className="bg-black text-white mb-4">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.user.profilePhoto} alt={post.user.username} />
            <AvatarFallback>{post.user.username?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{post.user.username}</p>
            <p className="text-xs text-gray-400">Suggested for you</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Follow</Button>
            <MoreHorizontal />
        </div>
      </div>
      <Image src={post.image} alt={post.caption} width={500} height={500} className="w-full" />
      <div className="flex justify-between p-2">
        <div className="flex space-x-4">
          <Heart />
          <MessageCircle />
          <Send />
        </div>
      </div>
      <div className="p-2">
        <p className="font-bold">{post.likes.length} likes</p>
        <p>
          <span className="font-bold">{post.user.username}</span> {post.caption}
        </p>
      </div>
    </div>
  );
}
