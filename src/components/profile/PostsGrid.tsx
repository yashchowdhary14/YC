'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Camera } from 'lucide-react';

interface Post {
  id: string;
  imageUrl: string;
  imageHint: string;
  likes: number;
  commentsCount: number;
}

interface PostsGridProps {
  posts: Post[];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed">
            <Camera className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">No Posts Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">When you share photos, they will appear on your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1 font-semibold">
                  <Heart className="h-5 w-5" />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold">
                  <MessageCircle className="h-5 w-5" />
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
