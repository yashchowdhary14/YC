
'use client';

import { useStoryCreationStore, useActiveStorySlide } from '@/lib/story-creation-store';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const filters = [
    { name: 'Original', className: '', style: 'none' },
    { name: 'Clarendon', className: 'filter-clarendon', style: 'contrast(1.2) saturate(1.35)' },
    { name: 'Gingham', className: 'filter-gingham', style: 'brightness(1.05) hue-rotate(-10deg)' },
    { name: 'Moon', className: 'filter-moon', style: 'grayscale(1) contrast(1.1) brightness(1.1)' },
    { name: 'Lark', className: 'filter-lark', style: 'contrast(0.9) brightness(1.2)' },
    { name: 'Reyes', className: 'filter-reyes', style: 'sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)' },
    { name: 'Slumber', className: 'filter-slumber', style: 'saturate(0.66) brightness(1.05)' },
    { name: 'Crema', className: 'filter-crema', style: 'sepia(0.5) contrast(1.25) brightness(1.15)' },
    { name: 'Ludwig', className: 'filter-ludwig', style: 'contrast(1.05) saturate(1.5) brightness(0.95)' },
    { name: 'Aden', className: 'filter-aden', style: 'hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)' },
    { name: 'Perpetua', className: 'filter-perpetua', style: 'contrast(1.1) brightness(1.25) saturate(1.1)' },
];

function FilterPreview({ filter, imageUrl, onSelect, isSelected }: { filter: any, imageUrl: string, onSelect: () => void, isSelected: boolean }) {
    return (
        <div 
            onClick={onSelect} 
            className="flex flex-col items-center gap-2 cursor-pointer shrink-0"
        >
            <div className={`w-20 h-24 rounded-md overflow-hidden border-2 transition-colors ${isSelected ? 'border-primary' : 'border-transparent'}`}>
                <Image 
                    src={imageUrl} 
                    alt={filter.name} 
                    width={80} 
                    height={96}
                    className={`object-cover w-full h-full ${filter.className}`}
                />
            </div>
            <p className={`text-xs font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>{filter.name}</p>
        </div>
    )
}

export default function FilterStrip() {
    const activeSlide = useActiveStorySlide();
    const updateSlide = useStoryCreationStore(s => s.updateSlide);

    if (!activeSlide) return null;

    const handleSelectFilter = (filterClassName: string) => {
        updateSlide(activeSlide.id, { filterClassName });
    }

    return (
        <motion.div 
            className="w-full pb-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
        >
            <div className="flex gap-4 overflow-x-auto pb-2 px-4">
                {filters.map(filter => (
                    <FilterPreview 
                        key={filter.name}
                        filter={filter}
                        imageUrl={activeSlide.media.url}
                        onSelect={() => handleSelectFilter(filter.className)}
                        isSelected={activeSlide.filterClassName === filter.className}
                    />
                ))}
            </div>
        </motion.div>
    )
}
