
'use client';

import { useState } from 'react';
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

type PostPreviewProps = {
    files: File[];
    setFiles: (files: File[]) => void;
    isStory?: boolean;
};

export default function PostPreview({ files, setFiles, isStory = false }: PostPreviewProps) {
    const [api, setApi] = useState<CarouselApi>();

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };
    
    const aspectClass = isStory ? 'aspect-[9/16] h-full' : 'aspect-square w-full';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <Carousel setApi={setApi} className="w-full h-full flex items-center">
                <CarouselContent>
                    {files.map((file, index) => (
                        <CarouselItem key={`${file.name}-${index}`}>
                            <div className={cn("relative mx-auto", aspectClass)}>
                                {file.type.startsWith('image/') ? (
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`preview ${index}`}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        controls
                                        className="w-full h-full object-contain"
                                    />
                                )}
                                {files.length > 1 && !isStory && (
                                     <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full z-10"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {files.length > 1 && !isStory && (
                    <>
                     <CarouselPrevious className="left-2" />
                     <CarouselNext className="right-2" />
                    </>
                )}
            </Carousel>
            
            {files.length > 1 && !isStory && (
                <div className="flex gap-2 mt-4">
                    <AnimatePresence>
                    {files.map((_, index) => (
                         <motion.div 
                            key={`${files[index].name}-${index}-dot`}
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
            
            {/* TODO: Add 'Add More' button */}
        </div>
    );
}
