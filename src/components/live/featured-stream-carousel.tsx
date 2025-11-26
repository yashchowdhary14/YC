
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import type { Stream } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatCompactNumber } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';


interface FeaturedStreamCarouselProps {
    streams: Stream[];
}

function FeaturedStreamCard({ stream }: { stream: Stream }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-0 md:gap-0.5">
        <div className="md:col-span-3 lg:col-span-2 relative aspect-video bg-zinc-800 rounded-t-lg md:rounded-lg overflow-hidden group">
             <Image 
                src={stream.thumbnailUrl!} 
                alt={stream.title} 
                fill 
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-105",
                  isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                )}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
             />
             <div className="absolute top-2 left-2 md:top-4 md:left-4">
                <Badge variant="destructive" className="bg-red-600 font-bold uppercase text-sm h-6 px-3">Live</Badge>
             </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1 bg-zinc-800 p-4 rounded-b-lg md:rounded-lg flex flex-col justify-between">
            <div>
                 <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={stream.user.avatarUrl} />
                        <AvatarFallback>{stream.user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-white text-lg">{stream.user.username}</p>
                        <p className="text-base text-zinc-300">{stream.category}</p>
                        <p className="text-sm text-zinc-400">{formatCompactNumber(stream.viewerCount)} viewers</p>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {stream.tags.map(tag => (
                         <Badge key={tag} variant="secondary" className="text-xs font-semibold bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-3 py-1">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <p className="text-zinc-200 text-base mt-4 line-clamp-2">{stream.title}</p>
        </div>
    </div>
  )
}


export default function FeaturedStreamCarousel({ streams }: FeaturedStreamCarouselProps) {
  return (
    <Carousel
        opts={{
          align: 'start',
          loop: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {streams.map((stream) => (
            <CarouselItem key={stream.id} className="pl-4">
              <Link href={`/${stream.user.username}`} className="block">
                <FeaturedStreamCard stream={stream} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-zinc-700 border-none hover:bg-zinc-600 text-white hidden md:flex" />
        <CarouselNext className="right-2 bg-zinc-700 border-none hover:bg-zinc-600 text-white hidden md:flex" />
      </Carousel>
  );
}
