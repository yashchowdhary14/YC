
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, PlayCircle, Clapperboard } from 'lucide-react';
import { Post } from '@/lib/types';
import { formatCompactNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PostTileProps {
  post: Post;
}

export default function PostTile({ post }: PostTileProps) {
  return (
    <Link href={`/p/${post.id}`} className="block w-full h-full group">
      <div className="relative w-full aspect-square overflow-hidden rounded-none md:rounded-lg">
        <Image
          src={post.thumbnailUrl}
          alt={post.caption || 'User post'}
          fill
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="flex items-center gap-6 text-white font-semibold">
            <div className="flex items-center gap-1.5">
              <Heart className="h-5 w-5 fill-white" />
              <span>{formatCompactNumber(post.likes)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-5 w-5 fill-white" />
              <span>{formatCompactNumber(post.commentsCount)}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 pointer-events-none">
          {post.type === 'reel' && <Clapperboard className="h-5 w-5 text-white shadow-lg" />}
          {post.type === 'video' && <PlayCircle className="h-5 w-5 text-white shadow-lg" />}
        </div>
      </div>
    </Link>
  );
}
