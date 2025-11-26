
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, PlayCircle, Clapperboard } from 'lucide-react';
import { Post } from '@/lib/types';
import { formatCompactNumber, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PostTileProps {
  post: Post;
}

export default function PostTile({ post }: PostTileProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link href={`/p/${post.id}`} className="block w-full h-full group">
      <motion.div
        className="relative w-full aspect-square overflow-hidden rounded-none md:rounded-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-muted"
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <Image
          src={post.thumbnailUrl}
          alt={post.caption || 'User post'}
          fill
          className={cn(
            'object-cover transition-all duration-500 ease-in-out group-hover:scale-105',
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onLoad={() => setIsLoaded(true)}
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
      </motion.div>
    </Link>
  );
}
