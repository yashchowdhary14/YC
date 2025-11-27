
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCreateStore } from '@/lib/create-store';
import FilterStrip from '@/components/story-creation/FilterStrip';

type PostPreviewProps = {
    isStory?: boolean;
};

export default function PostPreview({ isStory = false }: PostPreviewProps) {
    const { media, removeMedia, setActiveMediaId } = useCreateStore();
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;

        const handleSelect = () => {
            const selectedIndex = api.selectedScrollSnap();
            const activeItem = media[selectedIndex];
            if (activeItem) {
                setActiveMediaId(activeItem.id);
            }
        };

        api.on("select", handleSelect);
        // Set initial active media
        if (media.length > 0) {
            handleSelect();
        }

        return () => {
            api.off("select", handleSelect);
        };
    }, [api, media, setActiveMediaId]);
    
    const aspectClass = isStory ? 'aspect-[9/16] h-full' : 'aspect-square w-full';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-0 sm:p-4">
            <div className="w-full flex-1 flex items-center justify-center relative">
                <Carousel setApi={setApi} className="w-full h-full flex items-center justify-center">
                    <CarouselContent className="h-full">
                        {media.map((item, index) => (
                            <CarouselItem key={item.id} className="flex items-center justify-center">
                                <div className={cn("relative mx-auto h-full w-full", aspectClass)}>
                                    {item.type === 'photo' ? (
                                        <Image
                                            src={item.url}
                                            alt={`preview ${index}`}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                    {media.length > 1 && !isStory && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 rounded-full z-10"
                                            onClick={() => removeMedia(item.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {media.length > 1 && !isStory && (
                        <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                        </>
                    )}
                </Carousel>
            </div>
            
            {media.length > 1 && !isStory && (
                <div className="flex gap-2 mt-4">
                    <AnimatePresence>
                    {media.map((_, index) => (
                         <motion.div 
                            key={`${media[index].id}-dot`}
                            layout
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                         >
                            <button
                                onClick={() => api?.scrollTo(index)}
                                className={`h-2 w-2 rounded-full transition-colors ${
                                    api?.selectedScrollSnap() === index ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                         </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            )}
            
            <div className="w-full pt-4">
                <FilterStrip />
            </div>
        </div>
    );
}
