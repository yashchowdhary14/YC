
'use client';

import { useCreateStore, DrawingElement } from '@/lib/create-store';
import { useRef, useState, PointerEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Eraser, Highlighter, Pen, Palette } from 'lucide-react';


const getSvgPathFromPoints = (points: DrawingElement['points']) => {
  if (points.length < 2) return '';
  const d = points.reduce(
    (acc, point, i, a) =>
      i === 0
        ? `M ${point.x},${point.y}`
        : `${acc} L ${point.x},${point.y}`,
    ''
  );
  return d;
};


const DrawingToolbar = ({ activeTool, setActiveTool, activeColor, setActiveColor }: any) => {
  const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/50 rounded-full p-2 flex items-center gap-2"
        initial={{ y: -100, opacity: 0}}
        animate={{ y: 0, opacity: 1}}
        exit={{ y: -100, opacity: 0}}
      >
        <button onClick={() => setActiveTool('pen')} className={cn('p-2 rounded-full', activeTool === 'pen' && 'bg-primary')}>
          <Pen className="h-6 w-6 text-white" />
        </button>
        <button onClick={() => setActiveTool('highlighter')} className={cn('p-2 rounded-full', activeTool === 'highlighter' && 'bg-primary')}>
          <Highlighter className="h-6 w-6 text-white" />
        </button>
        <button onClick={() => setActiveTool('eraser')} className={cn('p-2 rounded-full', activeTool === 'eraser' && 'bg-primary')}>
          <Eraser className="h-6 w-6 text-white" />
        </button>
        <div className="h-8 w-px bg-gray-600 mx-1"></div>
        <div className="flex gap-1">
          {colors.map(color => (
            <button key={color} onClick={() => setActiveColor(color)} className="h-6 w-6 rounded-full border-2" style={{ backgroundColor: color, borderColor: activeColor === color ? 'white' : 'transparent' }}></button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function DrawingCanvas() {
  const { activeMediaId, media, updateMedia } = useCreateStore();
  const activeSlide = media.find(s => s.id === activeMediaId);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [activeColor, setActiveColor] = useState('#FFFFFF');

  const currentPathRef = useRef<DrawingElement | null>(null);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPathRef.current = {
      id: `drawing_${Date.now()}`,
      brush: activeTool,
      color: activeTool === 'eraser' ? 'erase' : activeColor,
      strokeWidth: activeTool === 'pen' ? 5 : 20,
      points: [{ x, y }],
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !currentPathRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPathRef.current.points.push({ x, y });

    // For instant feedback, we can update the slide here, but it can be costly.
    // A better approach is to render the current path separately until pointer up.
    // For simplicity, we'll update the store.
    if (activeSlide) {
      const otherDrawings = activeSlide.drawings.filter(
        (d) => d.id !== currentPathRef.current!.id
      );
      updateMedia(activeSlide.id, {
        drawings: [...otherDrawings, currentPathRef.current],
      });
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    currentPathRef.current = null;
  };
  
  if (!activeSlide) return null;

  return (
    <div className="absolute inset-0 z-20">
      <DrawingToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      />
      <div
        className="w-full h-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} // End drawing if pointer leaves area
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        >
           {/* Apply a mask for eraser effect */}
          <defs>
            <mask id="eraserMask">
              <rect width="100%" height="100%" fill="white" />
              {activeSlide.drawings
                .filter((d) => d.color === 'erase')
                .map((drawing) => (
                  <path
                    key={drawing.id}
                    d={getSvgPathFromPoints(drawing.points)}
                    fill="none"
                    stroke="black"
                    strokeWidth={drawing.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
            </mask>
          </defs>

          <g mask="url(#eraserMask)">
              {activeSlide.drawings
                .filter((d) => d.color !== 'erase')
                .map((drawing) => (
                <path
                  key={drawing.id}
                  d={getSvgPathFromPoints(drawing.points)}
                  fill="none"
                  stroke={drawing.color}
                  strokeWidth={drawing.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    opacity: drawing.brush === 'highlighter' ? 0.7 : 1,
                  }}
                />
              ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
