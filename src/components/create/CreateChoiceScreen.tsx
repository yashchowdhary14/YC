
'use client';

import { Camera, Clapperboard, PlusSquare, Video, Wifi } from "lucide-react";

const creationOptions = [
  { type: 'post', label: 'Create Post', icon: PlusSquare },
  { type: 'reel', label: 'Create Reel', icon: Clapperboard },
  { type: 'video', label: 'Upload Video', icon: Video },
  { type: 'story', label: 'Create Story', icon: Camera },
  { type: 'live', label: 'Go Live', icon: Wifi, href: '/studio/broadcast' },
];

export type CreateMode = "post" | "reel" | "video" | "story" | "live";

interface CreateChoiceScreenProps {
  onSelect: (type: CreateMode) => void;
}

export default function CreateChoiceScreen({ onSelect }: CreateChoiceScreenProps) {

  const handleItemClick = (type: CreateMode) => {
    onSelect(type);
  };
  
  return (
    <div className="flex flex-col h-full items-center justify-center text-center">
       <div className="space-y-4 w-full">
         {creationOptions.map(option => (
            <button
                key={option.type}
                onClick={() => handleItemClick(option.type as CreateMode)}
                className="w-full flex items-center justify-between p-4 rounded-lg text-left transition-colors hover:bg-accent"
            >
                <div className="flex items-center gap-4">
                    <option.icon className="h-6 w-6" />
                    <span className="font-semibold text-base">{option.label}</span>
                </div>
                 <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
         ))}
       </div>
    </div>
  );
}
