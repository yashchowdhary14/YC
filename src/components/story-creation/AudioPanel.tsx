'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Mic, Plus } from 'lucide-react';

// Placeholder for a single audio track UI
const AudioTrack = ({ name, type }: { name: string, type: 'music' | 'voiceover' }) => (
    <div className="flex items-center gap-4 p-2 bg-secondary rounded-lg">
        {type === 'music' ? <Music className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        <div className="flex-1">
            <p className="text-sm font-semibold">{name}</p>
            {/* Placeholder for waveform/trimmer */}
            <div className="h-10 bg-muted rounded-md mt-1"></div>
        </div>
    </div>
);


export default function AudioPanel() {
    return (
        <motion.div
            className="w-full h-full flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Audio Layers</h3>
                <Button variant="ghost" size="sm">Done</Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    <AudioTrack name="lofi-beats.mp3" type="music" />
                    <AudioTrack name="Voiceover_01.wav" type="voiceover" />
                </div>
            </ScrollArea>
            <div className="p-4 border-t flex items-center gap-4">
                 <Button className="flex-1">
                    <Music className="mr-2 h-4 w-4" />
                    Add Music
                </Button>
                 <Button variant="secondary" className="flex-1">
                    <Mic className="mr-2 h-4 w-4" />
                    Record Voiceover
                </Button>
            </div>
        </motion.div>
    );
}
