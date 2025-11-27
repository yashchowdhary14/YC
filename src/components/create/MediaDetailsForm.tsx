
'use client';

import { useState, useMemo } from 'react';
import type { CreateMode, FinalizedCreateData } from './types';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { ChevronRight, Users, MapPin, Search, Bot, EyeOff, MessageSquareOff, Settings2, Shield, Globe, Users2 } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CaptionInput from './details/CaptionInput';
import { useToast } from '@/hooks/use-toast';
import TagPeopleModal from './details/TagPeopleModal';
import AddLocationModal from './details/AddLocationModal';
import AccessibilityModal from './details/AccessibilityModal';
import PostSettings from './details/PostSettings';
import VideoSettings from './details/VideoSettings';
import StorySettings from './details/StorySettings';
import { useCreateStore } from '@/lib/create-store';

type MediaDetailsFormProps = {
  mode: Exclude<CreateMode, 'live'>;
  onBack: () => void;
  onSubmit: (payload: FinalizedCreateData) => void;
};

export default function MediaDetailsForm({ mode, onBack, onSubmit }: MediaDetailsFormProps) {
  const { toast } = useToast();
  const { media } = useCreateStore();

  // Local state for the form
  const [caption, setCaption] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Modals state
  const [isTagging, setIsTagging] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isAccessibility, setIsAccessibility] = useState(false);

  // Data state
  const [taggedUsers, setTaggedUsers] = useState<Record<string, string[]>>({});
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [altTexts, setAltTexts] = useState<string[]>(() => media.map((_, i) => ''));

  // Settings State
  const [settings, setSettings] = useState<FinalizedCreateData['settings']>({
    hideLikes: false,
    disableComments: false,
    visibility: 'public',
    storyAudience: 'everyone'
  });

  const previewUrl = useMemo(() => media.length > 0 ? media[0].url : '', [media]);
  const files = useMemo(() => media.map(m => m.file), [media]);

  const totalTaggedCount = useMemo(() => {
    const allTags = new Set<string>();
    Object.values(taggedUsers).forEach(tags => tags.forEach(tag => allTags.add(tag)));
    return allTags.size;
  }, [taggedUsers]);

  const handlePublish = () => {
    // Flatten tags for simple list if needed, or keep structure. 
    // For now, we'll just send the list of all unique collaborators.
    const allCollaborators = Array.from(new Set(Object.values(taggedUsers).flat()));

    // Convert taggedUsers (by ID) to taggedUsers (by Index) for the feed
    const taggedUsersByIndex: Record<string, string[]> = {};
    media.forEach((item, index) => {
      if (taggedUsers[item.id]) {
        taggedUsersByIndex[index.toString()] = taggedUsers[item.id];
      }
    });

    const payload: FinalizedCreateData = {
      mode,
      files,
      caption,
      tags: hashtags,
      mentions,
      location,
      collaborators: allCollaborators,
      taggedUsers: taggedUsersByIndex,
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
          <div className="md:w-1/2 lg:w-3/5 border-b md:border-b-0 md:border-r p-4 flex items-center justify-center bg-black relative group">
            {media.length === 1 ? (
              <div className="relative w-full max-w-sm aspect-square">
                {media[0].type === 'video' ? (
                  <video src={media[0].url} className="w-full h-full object-contain rounded-md" controls />
                ) : (
                  <Image src={media[0].url} alt="Preview" fill className="object-contain rounded-md" />
                )}
              </div>
            ) : (
              <Carousel className="w-full max-w-sm aspect-square">
                <CarouselContent>
                  {media.map((item, index) => (
                    <CarouselItem key={item.id}>
                      <div className="relative w-full aspect-square">
                        {item.type === 'video' ? (
                          <video src={item.url} className="w-full h-full object-contain rounded-md" controls />
                        ) : (
                          <Image src={item.url} alt={`Preview ${index + 1}`} fill className="object-contain rounded-md" />
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            )}
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
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Tag people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalTaggedCount > 0 && <span className="text-sm text-muted-foreground">{totalTaggedCount} tagged</span>}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
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
        media={media}
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
