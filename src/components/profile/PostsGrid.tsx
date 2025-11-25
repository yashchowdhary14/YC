'use client';

import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

// Placeholder for PostsGrid component
export default function PostsGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-card-foreground mb-2">Posts Grid Placeholder</h3>
      <div className="grid grid-cols-3 gap-1">
        {posts.map(post => (
          <div key={post.id} className="aspect-square relative">
             <Image
                src={post.imageUrl}
                alt={post.imageHint || 'Post image'}
                fill
                className="object-cover"
              />
          </div>
        ))}
      </div>
    </div>
  );
}
