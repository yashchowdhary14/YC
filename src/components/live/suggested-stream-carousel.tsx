
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Stream } from '@/lib/types';
import StreamCard from './stream-card';

interface SuggestedStreamCarouselProps {
    streams: Stream[];
}

export default function SuggestedStreamCarousel({ streams }: SuggestedStreamCarouselProps) {
  return (
    <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {streams.map((stream) => (
            <CarouselItem key={stream.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <StreamCard stream={stream} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
  );
}
