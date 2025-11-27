
'use client';

import { Camera, Clapperboard, PlusSquare, Video, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";

const creationOptions = [
  { type: 'post', label: 'Create Post', icon: PlusSquare, href: '/create/post' },
  { type: 'reel', label: 'Create Reel', icon: Clapperboard, href: '/create/video' },
  { type: 'video', label: 'Upload Video', icon: Video, href: '/create/video' },
  { type: 'story', label: 'Create Story', icon: Camera, href: '/create/story' },
  { type: 'live', label: 'Go Live', icon: Wifi, href: '/studio/broadcast' },
];

interface CreateChoiceScreenProps {
  onSelect: (type: string, href: string) => void;
}

export default function CreateChoiceScreen({ onSelect }: CreateChoiceScreenProps) {
  const router = useRouter();

  const handleItemClick = (type: string, href: string) => {
    onSelect(type, href);
    router.push(href);
  };
  
  return (
    <div className="flex flex-col h-full items-center justify-center text-center">
       <div className="space-y-4 w-full">
         {creationOptions.map(option => (
            <button
                key={option.type}
                onClick={() => handleItemClick(option.type, option.href)}
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
