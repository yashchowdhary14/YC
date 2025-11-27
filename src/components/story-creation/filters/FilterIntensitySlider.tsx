
'use client';

import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface FilterIntensitySliderProps {
    intensity: number;
    onIntensityChange: (intensity: number) => void;
}

export default function FilterIntensitySlider({ intensity, onIntensityChange }: FilterIntensitySliderProps) {
    return (
        <motion.div
            className="w-full px-8 py-2 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
        >
            <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                <span className="text-white text-xs font-semibold">Intensity</span>
                <Slider
                    value={[intensity]}
                    onValueChange={(value) => onIntensityChange(value[0])}
                    max={1}
                    step={0.01}
                />
                <span className="text-white text-xs font-semibold w-10 text-right">{Math.round(intensity * 100)}%</span>
            </div>
        </motion.div>
    );
}
