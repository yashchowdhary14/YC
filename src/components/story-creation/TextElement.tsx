
'use client';

import { useCreateStore, TextElement as TextElementType } from '@/lib/create-store';
import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface TextElementProps {
    element: TextElementType;
    slideId: string;
}

export default function TextElement({ element, slideId }: TextElementProps) {
    const { updateMedia, media } = useCreateStore();
    const activeSlide = media.find(s => s.id === slideId);
    
    // In future steps, we will use state to handle editing, dragging, etc.
    const [isEditing, setIsEditing] = useState(false);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!activeSlide) return;

        const parent = (event.target as HTMLElement).parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();

        const newPosition = {
            x: ((info.point.x - parentRect.left) / parentRect.width) * 100,
            y: ((info.point.y - parentRect.top) / parentRect.height) * 100,
        };

        const updatedTexts = activeSlide.texts.map(text => 
            text.id === element.id ? { ...text, position: newPosition } : text
        );

        updateMedia(slideId, { texts: updatedTexts });
    };

    const textStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${element.position.y}%`,
        left: `${element.position.x}%`,
        transform: `translate(-50%, -50%) scale(${element.scale}) rotate(${element.rotation}deg)`,
        color: element.color,
        fontFamily: element.font,
        cursor: 'move',
        whiteSpace: 'pre-wrap',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(0,0,0,0.3)',
        fontSize: '2rem', // A good starting size
        fontWeight: 'bold',
    };

    return (
        <motion.div
            drag
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            style={textStyle}
            // We set the initial position here to prevent snapping on first drag
            initial={{
                x: `calc(${element.position.x}% - 50%)`,
                y: `calc(${element.position.y}% - 50%)`,
            }}
        >
            {element.text}
        </motion.div>
    );
}
