
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { dummyUsers } from '@/lib/dummy-data';
import { Search } from 'lucide-react';
import { debounce } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from 'next/image';
import { MediaObject } from '@/lib/create-store';

interface TagPeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaObject[];
  taggedUsers: Record<string, string[]>;
  setTaggedUsers: (users: Record<string, string[]>) => void;
}

export default function TagPeopleModal({ isOpen, onClose, media, taggedUsers, setTaggedUsers }: TagPeopleModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setActiveSlideIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const activeMediaId = media[activeSlideIndex]?.id;

  useEffect(() => {
    const handler = debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300);

    handler(searchTerm);

    return () => {
      // Cleanup not strictly necessary for this simple debounce implementation but good practice if we had a cancel method
    };
  }, [searchTerm]);

  const filteredUsers = dummyUsers.filter(user =>
    user.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleToggleUser = (username: string) => {
    if (!activeMediaId) return;

    const currentTags = taggedUsers[activeMediaId] || [];
    const isTagged = currentTags.includes(username);

    let newTags;
    if (isTagged) {
      newTags = currentTags.filter(u => u !== username);
    } else {
      newTags = [...currentTags, username];
    }

    setTaggedUsers({
      ...taggedUsers,
      [activeMediaId]: newTags
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col h-[80vh] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Tag people</DialogTitle>
        </DialogHeader>

        {/* Carousel for Media Selection */}
        {media.length > 0 && (
          <div className="w-full flex justify-center py-2 bg-black/5 rounded-md mb-2">
            <Carousel setApi={setApi} className="w-48 aspect-square">
              <CarouselContent>
                {media.map((item, index) => (
                  <CarouselItem key={item.id}>
                    <div className="relative w-full aspect-square rounded-md overflow-hidden">
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={item.url} alt={`Media ${index + 1}`} fill className="object-cover" />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {media.length > 1 && (
                <>
                  <CarouselPrevious className="-left-4" />
                  <CarouselNext className="-right-4" />
                </>
              )}
            </Carousel>
          </div>
        )}

        <div className="relative px-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for people"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="px-1 py-2 text-xs text-muted-foreground text-center">
          Tagging for item {activeSlideIndex + 1} of {media.length}
        </div>

        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6 space-y-1">
            {filteredUsers.map(user => {
              const isTagged = activeMediaId ? (taggedUsers[activeMediaId] || []).includes(user.username) : false;
              return (
                <div
                  key={user.id}
                  onClick={() => handleToggleUser(user.username)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.fullName}</p>
                  </div>
                  <Checkbox
                    checked={isTagged}
                    onCheckedChange={() => handleToggleUser(user.username)}
                    aria-label={`Tag ${user.username}`}
                  />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
