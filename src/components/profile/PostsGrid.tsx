'use client';

import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

interface PostsGridProps {
  posts: Post[];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-card text-center">
        <h3 className="text-lg font-semibold text-card-foreground">No Posts Yet</h3>
        <p className="text-muted-foreground mt-2">When this user shares a photo, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <Link key={post.id} href={`/p/${post.id}`} className="group relative aspect-square block">
          <Image
            src={post.imageUrl}
            alt={post.imageHint || 'User post'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>{post.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>{post.commentsCount.toLocaleString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
