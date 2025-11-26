
'use client';

import { useStoryCreationStore, TextElement as TextElementType } from '@/lib/story-creation-store';
import { useState } from 'react';

interface TextElementProps {
    element: TextElementType;
    slideId: string;
}

export default function TextElement({ element, slideId }: TextElementProps) {
    const { updateSlide } = useStoryCreationStore();
    
    // In future steps, we will use state to handle editing, dragging, etc.
    const [isEditing, setIsEditing] = useState(false);

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
        <div style={textStyle}>
            {element.text}
        </div>
    );
}
