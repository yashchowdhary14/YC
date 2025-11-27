
'use client';

import { useState, useMemo } from 'react';
import type { CreateMode, FinalizedCreateData } from './types';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { ChevronRight, Users, MapPin, Search, Bot, EyeOff, MessageSquareOff, Settings2, Shield, Globe, Users2 } from 'lucide-react';
import Image from 'next/image';
import CaptionInput from './details/CaptionInput';
import { useToast } from '@/hooks/use-toast';
import TagPeopleModal from './details/TagPeopleModal';
import AddLocationModal from './details/AddLocationModal';
import AccessibilityModal from './details/AccessibilityModal';
import PostSettings from './details/PostSettings';
import VideoSettings from './details/VideoSettings';
import StorySettings from './details/StorySettings';

type MediaDetailsFormProps = {
  mode: Exclude<CreateMode, 'live'>;
  files: File[];
  onBack: () => void;
  onSubmit: (payload: FinalizedCreateData) => void;
};

export default function MediaDetailsForm({ mode, files, onBack, onSubmit }: MediaDetailsFormProps) {
  const { toast } = useToast();
  const [caption, setCaption] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  // Modals state
  const [isTagging, setIsTagging] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isAccessibility, setIsAccessibility] = useState(false);

  // Data state
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [altTexts, setAltTexts] = useState<string[]>(() => files.map((_, i) => `Media ${i + 1}`));
  
  // Settings State
  const [settings, setSettings] = useState<FinalizedCreateData['settings']>({
      hideLikes: false,
      disableComments: false,
      visibility: 'public',
      storyAudience: 'everyone'
  });

  const previewUrl = useMemo(() => files.length > 0 ? URL.createObjectURL(files[0]) : '', [files]);

  const handlePublish = () => {
    const payload: FinalizedCreateData = {
        mode,
        files,
        caption,
        tags: hashtags,
        mentions,
        location,
        collaborators: [], // To be implemented
        productTags: [], // To be implemented
        accessibility: {
            alt: altTexts,
        },
        settings,
    };
    onSubmit(payload);
  };
  
  const renderSettings = () => {
    switch (mode) {
      case 'post':
      case 'reel':
        return <PostSettings settings={settings} setSettings={setSettings} />;
      case 'video':
        return <VideoSettings settings={settings} setSettings={setSettings} />;
      case 'story':
        return <StorySettings settings={settings} setSettings={setSettings} />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="h-full w-full flex flex-col md:flex-row bg-background text-foreground">
        <header className="absolute top-0 left-0 right-0 p-2 flex md:hidden items-center justify-between z-10 bg-background/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Details</h2>
            <Button variant="link" onClick={handlePublish}>Publish</Button>
        </header>
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/2 lg:w-3/5 border-b md:border-b-0 md:border-r p-4 flex items-center justify-center bg-black">
              <div className="relative w-full max-w-sm aspect-square">
                  {previewUrl && <Image src={previewUrl} alt="Preview" fill className="object-contain rounded-md" />}
              </div>
          </div>
          <div className="md:w-1/2 lg:w-2/5 flex flex-col">
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    <CaptionInput
                        mode={mode}
                        caption={caption}
                        setCaption={setCaption}
                        setMentions={setMentions}
                        setHashtags={setHashtags}
                    />

                    <Separator />
                    
                    <button onClick={() => setIsTagging(true)} className="flex items-center justify-between w-full text-left p-2 -mx-2 rounded-md hover:bg-accent">
                        <div className="flex items-center gap-3">
                           <Users className="h-5 w-5"/>
                           <span className="font-medium">Tag people</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                    
                    <Separator />

                    <button onClick={() => setIsLocating(true)} className="flex items-center justify-between w-full text-left p-2 -mx-2 rounded-md hover:bg-accent">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5" />
                            <span className="font-medium">Add location</span>
                        </div>
                         <div className="flex items-center gap-2">
                            {location && <span className="text-sm text-muted-foreground max-w-xs truncate">{location}</span>}
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </button>
                    
                     <Separator />

                    <button onClick={() => setIsAccessibility(true)} className="flex items-center justify-between w-full text-left p-2 -mx-2 rounded-md hover:bg-accent">
                        <div className="flex items-center gap-3">
                           <Search className="h-5 w-5" />
                           <span className="font-medium">Accessibility</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>

                    <Separator />
                    
                    {renderSettings()}

                </div>
            </ScrollArea>
            <div className="p-4 border-t hidden md:block">
                 <Button onClick={handlePublish} className="w-full">Publish</Button>
            </div>
          </div>
        </main>
      </div>

      <TagPeopleModal
        isOpen={isTagging}
        onClose={() => setIsTagging(false)}
        taggedUsers={taggedUsers}
        setTaggedUsers={setTaggedUsers}
      />
      <AddLocationModal
        isOpen={isLocating}
        onClose={() => setIsLocating(false)}
        location={location}
        setLocation={setLocation}
      />
      <AccessibilityModal
         isOpen={isAccessibility}
         onClose={() => setIsAccessibility(false)}
         files={files}
         altTexts={altTexts}
         setAltTexts={setAltTexts}
      />
    </>
  );
}
