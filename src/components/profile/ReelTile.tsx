'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { Play } from 'lucide-react';

interface ReelTileProps {
  reel: Post;
}

const ReelTile: React.FC<ReelTileProps> = ({ reel }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link href={`/reels?reelId=${reel.id}`} className="block w-full h-full group">
      <motion.div
        className="absolute inset-0 bg-muted"
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      <Image
        src={reel.thumbnailUrl}
        alt={reel.caption || 'User reel'}
        fill
        className={cn(
          'object-cover transition-all duration-500 ease-in-out group-hover:scale-105',
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
        )}
        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setIsLoaded(true)}
      />
      
      <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
        <div className="flex items-center gap-4 text-white font-semibold">
          <div className="flex items-center gap-1.5">
            <Play className="h-5 w-5 fill-white" />
            <span>{formatCompactNumber(reel.views)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReelTile;
