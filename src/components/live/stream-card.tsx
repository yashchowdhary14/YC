
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { LiveBroadcast } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCompactNumber } from '@/lib/utils';
import { AspectRatio } from '../ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StreamCardProps {
  stream: LiveBroadcast;
}

export default function StreamCard({ stream }: StreamCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <Link href={`/live/${stream.streamerName}`} className="group">
      <div className="relative mb-3 overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
            <Image
                src={stream.liveThumbnail}
                alt={stream.title}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-in-out group-hover:scale-105",
                  isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                )}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
            />
            <div className="absolute top-2 left-2">
                <Badge variant="destructive" className="bg-red-600 font-bold uppercase text-xs h-5">Live</Badge>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                {formatCompactNumber(stream.viewerCount)} viewers
            </div>
        </AspectRatio>
      </div>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={stream.user.avatarUrl} alt={stream.user.username} />
          <AvatarFallback>{stream.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <h3 className="font-bold text-foreground truncate group-hover:text-primary text-base">
            {stream.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{stream.user.username}</p>
          <p className="text-sm text-muted-foreground truncate">{stream.category}</p>
        </div>
      </div>
    </Link>
  );
}
