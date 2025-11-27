
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { Heart, MessageCircle, PlayCircle, Clapperboard } from 'lucide-react';

interface PostTileProps {
  post: Post;
}

const getLinkHref = (post: Post) => {
    switch(post.type) {
        case 'photo': return `/p/${post.id}`;
        case 'reel': return `/reels`; // Reels page handles full-screen viewing
        case 'video': return `/watch/${post.id}`;
        default: return '#';
    }
}

const PostTile: React.FC<PostTileProps> = ({ post }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link href={getLinkHref(post)} className="block w-full h-full group">
        <motion.div
            className="absolute inset-0 bg-muted"
            animate={{ opacity: isLoaded ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />

        <Image
            src={post.thumbnailUrl || post.mediaUrl}
            alt={post.caption || 'User post'}
            fill
            className={cn(
                'object-cover transition-all duration-500 ease-in-out group-hover:scale-105',
                isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            )}
            sizes="(max-width: 768px) 33vw, 25vw"
            onLoad={() => setIsLoaded(true)}
        />
        
        {/* Overlay on hover */}
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
        
        {/* Corner icon for video/reel */}
        <div className="absolute top-2 right-2 pointer-events-none">
            {post.type === 'reel' && <Clapperboard className="h-5 w-5 text-white shadow-lg" />}
            {post.type === 'video' && <PlayCircle className="h-5 w-5 text-white shadow-lg" />}
        </div>
    </Link>
  );
};

export default PostTile;
