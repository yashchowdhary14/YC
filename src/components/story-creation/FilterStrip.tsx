
'use client';

import { useCreateStore, useActiveMediaObject } from '@/lib/create-store';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FilterIntensitySlider from './filters/FilterIntensitySlider';


export const filters = [
    { name: 'Original', className: '', style: 'none' },
    { name: 'Clarendon', className: 'filter-clarendon', style: 'brightness(1.05) contrast(1.12) saturate(1.12)' },
    { name: 'Gingham', className: 'filter-gingham', style: 'contrast(0.95) brightness(1.02) saturate(0.9)' },
    { name: 'Moon', className: 'filter-moon', style: 'grayscale(1) contrast(1.06) brightness(1.02)' },
    { name: 'Lark', className: 'filter-lark', style: 'brightness(1.03) saturate(1.15) contrast(1.02)' },
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
                    className="object-cover w-full h-full"
                    style={{ filter: filter.style }}
                />
            </div>
            <p className={`text-xs font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>{filter.name}</p>
        </div>
    )
}

export default function FilterStrip() {
    const activeSlide = useActiveMediaObject();
    const updateMedia = useCreateStore(s => s.updateMedia);

    if (!activeSlide) return null;

    const handleSelectFilter = (filterName: string) => {
        updateMedia(activeSlide.id, { filterName, filterIntensity: 1 });
    }

    return (
        <motion.div 
            className="w-full pb-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
        >
            {activeSlide.filterName && (
                <FilterIntensitySlider 
                    intensity={activeSlide.filterIntensity}
                    onIntensityChange={(intensity) => updateMedia(activeSlide.id, { filterIntensity: intensity })}
                />
            )}
            <div className="flex gap-4 overflow-x-auto pb-2 px-4">
                {filters.map(filter => (
                    <FilterPreview 
                        key={filter.name}
                        filter={filter}
                        imageUrl={activeSlide.url}
                        onSelect={() => handleSelectFilter(filter.name)}
                        isSelected={activeSlide.filterName === filter.name}
                    />
                ))}
            </div>
        </motion.div>
    )
}
