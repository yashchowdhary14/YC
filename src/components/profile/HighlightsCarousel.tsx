'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

// Mock data for story highlights
const highlights = [
  { id: '1', label: 'Travel', imageUrl: 'https://picsum.photos/seed/h1/150/150' },
  { id: '2', label: 'Food', imageUrl: 'https://picsum.photos/seed/h2/150/150' },
  { id: '3', label: 'Projects', imageUrl: 'https://picsum.photos/seed/h3/150/150' },
  { id: '4', label: 'Friends', imageUrl: 'https://picsum.photos/seed/h4/150/150' },
  { id: '5', label: 'Events', imageUrl: 'https://picsum.photos/seed/h5/150/150' },
  { id: '6', label: 'Work', imageUrl: 'https://picsum.photos/seed/h6/150/150' },
  { id: '7', label: 'Hobbies', imageUrl: 'https://picsum.photos/seed/h7/150/150' },
  { id: '8', label: 'Fitness', imageUrl: 'https://picsum.photos/seed/h8/150/150' },
];

export default function HighlightsCarousel() {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {/* Add New Highlight Button */}
          <CarouselItem className="basis-auto pl-4">
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                className="w-16 h-16 rounded-full border-dashed"
                aria-label="Add new highlight"
              >
                <PlusIcon className="h-6 w-6 text-muted-foreground" />
              </Button>
              <span className="text-xs text-muted-foreground">New</span>
            </div>
          </CarouselItem>

          {/* Existing Highlights */}
          {highlights.map((highlight) => (
            <CarouselItem key={highlight.id} className="basis-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                  <div className="p-0.5 bg-background rounded-full">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={highlight.imageUrl} alt={highlight.label} />
                      <AvatarFallback>{highlight.label.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs font-medium">{highlight.label}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 -translate-x-1/2" />
        <CarouselNext className="absolute right-0 translate-x-1/2" />
      </Carousel>
    </div>
  );
}