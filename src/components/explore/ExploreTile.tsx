
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils';
import { ExploreItem } from './types';
import { Heart, MessageCircle, PlayCircle, Clapperboard, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExploreTileProps {
  item: ExploreItem;
}

const getLinkHref = (item: ExploreItem) => {
    switch(item.type) {
        case 'photo': return `/p/${item.id}`;
        case 'reel': return `/reels`; // Reels page handles full-screen viewing
        case 'video': return `/watch/${item.id}`;
        case 'live': return `/live/${item.streamerName}`;
        default: return '#';
    }
}

const ExploreTile: React.FC<ExploreTileProps> = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link href={getLinkHref(item)} className="block w-full h-full group">
        <motion.div
            className="absolute inset-0 bg-zinc-800"
            animate={{ opacity: isLoaded ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />

        <Image
            src={item.thumbnailUrl}
            alt={item.caption || 'Explore content'}
            fill
            className={cn(
                'object-cover transition-all duration-500 ease-in-out group-hover:scale-105',
                isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onLoad={() => setIsLoaded(true)}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
            {item.type !== 'live' && (
                <div className="flex items-center gap-6 text-white font-semibold">
                    {typeof item.likes === 'number' && (
                        <div className="flex items-center gap-1.5">
                            <Heart className="h-5 w-5 fill-white" />
                            <span>{formatCompactNumber(item.likes)}</span>
                        </div>
                    )}
                     {typeof item.commentsCount === 'number' && (
                        <div className="flex items-center gap-1.5">
                            <MessageCircle className="h-5 w-5 fill-white" />
                            <span>{formatCompactNumber(item.commentsCount)}</span>
                        </div>
                    )}
                </div>
            )}
            {item.type === 'live' && (
                <div className="flex items-center gap-2 text-white font-semibold">
                     <Wifi className="h-5 w-5" />
                    <span>{formatCompactNumber(item.viewerCount || 0)} viewers</span>
                </div>
            )}
        </div>
        
        {/* Corner icons */}
        <div className="absolute top-2 right-2 pointer-events-none">
            {item.type === 'reel' && <Clapperboard className="h-5 w-5 text-white shadow-lg" />}
            {item.type === 'video' && <PlayCircle className="h-5 w-5 text-white shadow-lg" />}
            {item.type === 'live' && <Badge variant="destructive" className="font-bold uppercase text-xs">Live</Badge>}
        </div>
    </Link>
  );
};

export default ExploreTile;
