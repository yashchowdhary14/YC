
'use client';

import { usePostCreationStore, useActiveMedia } from '@/lib/post-creation-store';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AspectRatio } from '../ui/aspect-ratio';

const PostCarousel = () => {
    const { media, activeMediaId, setActiveMediaId } = usePostCreationStore();
    const activeMedia = useActiveMedia();

    if (!activeMedia) return null;

    const combinedFilter = `${activeMedia.filter || ''} brightness(${activeMedia.brightness / 100}) contrast(${activeMedia.contrast / 100})`;

    return (
        <div className="w-full h-full flex items-center justify-center">
            <AnimatePresence initial={false}>
                <motion.div 
                    key={activeMedia.id}
                    className="w-full h-full relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Image 
                        src={activeMedia.previewUrl} 
                        alt="Post preview" 
                        fill 
                        className="object-contain"
                        style={{
                            filter: combinedFilter,
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PostCarousel;
