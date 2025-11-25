
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Camera } from 'lucide-react';

interface Post {
  id: string;
  imageUrl: string;
  imageHint: string;
  likes: string[];
  commentsCount: number;
}

interface PostsGridProps {
  posts: Post[];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground">
          <Camera className="h-10 w-10 text-foreground" />
        </div>
        <h2 className="mt-2 text-2xl font-semibold">Share Photos</h2>
        <p className="text-muted-foreground text-sm">When you share photos, they will appear on your profile.</p>
        <Link href="/create">
          <span className="text-sm font-semibold text-primary hover:text-foreground">Share your first photo</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <Link key={post.id} href={`/p/${post.id}`}>
          <div className="group relative aspect-square w-full overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.imageHint || 'User post'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 33vw, 250px"
              data-ai-hint={post.imageHint}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2 font-semibold">
                  <Heart className="h-5 w-5 fill-white" />
                  <span>{post.likes?.length.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-5 w-5 fill-white" />
                  <span>{post.commentsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
