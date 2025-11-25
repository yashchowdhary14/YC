'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

const highlights = [
  {
    id: 'highlight-1',
    title: 'Travel',
    thumbnailUrl: 'https://picsum.photos/seed/highlight1/100/100',
  },
  {
    id: 'highlight-2',
    title: 'Eats',
    thumbnailUrl: 'https://picsum.photos/seed/highlight2/100/100',
  },
  {
    id: 'highlight-3',
    title: 'Projects',
    thumbnailUrl: 'https://picsum.photos/seed/highlight3/100/100',
  },
  {
    id: 'highlight-4',
    title: 'Fitness',
    thumbnailUrl: 'https://picsum.photos/seed/highlight4/100/100',
  },
   {
    id: 'highlight-5',
    title: 'Random',
    thumbnailUrl: 'https://picsum.photos/seed/highlight5/100/100',
  },
   {
    id: 'highlight-6',
    title: 'Memes',
    thumbnailUrl: 'https://picsum.photos/seed/highlight6/100/100',
  },
];

export default function HighlightsCarousel() {
  return (
    <div>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {/* Add New Highlight */}
          <CarouselItem className="basis-auto pl-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <button className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed bg-muted transition-colors hover:bg-accent hover:border-primary">
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="sr-only">Add new highlight</span>
              </button>
              <p className="w-20 truncate text-xs font-medium">New</p>
            </div>
          </CarouselItem>

          {/* Existing Highlights */}
          {highlights.map((highlight) => (
            <CarouselItem key={highlight.id} className="basis-auto pl-4">
               <button className="flex flex-col items-center gap-2 text-center">
                 <div className="p-0.5 rounded-full bg-gradient-to-tr from-muted via-muted to-muted">
                  <div className="p-0.5 bg-background rounded-full">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={highlight.thumbnailUrl} alt={highlight.title} />
                      <AvatarFallback>{highlight.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <p className="w-20 truncate text-xs font-medium">{highlight.title}</p>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
