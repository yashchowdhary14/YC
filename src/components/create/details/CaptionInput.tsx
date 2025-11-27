
'use client';

import { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { dummyUsers } from '@/lib/dummy-data';
import type { CreateMode } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CaptionInputProps {
  mode: Exclude<CreateMode, 'live'>;
  caption: string;
  setCaption: (caption: string) => void;
  setMentions: (mentions: string[]) => void;
  setHashtags: (hashtags: string[]) => void;
}

const charLimits: Record<Exclude<CreateMode, 'live' | 'story'>, number> = {
  post: 2200,
  reel: 2200,
  video: 5000,
};

export default function CaptionInput({ mode, caption, setCaption, setMentions, setHashtags }: CaptionInputProps) {
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const charLimit = mode !== 'story' ? charLimits[mode] : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if(charLimit && value.length > charLimit) return;
    setCaption(value);

    // Basic mention detection
    const mentionMatch = /@(\w+)$/.exec(value);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentionPopover(true);
    } else {
      setShowMentionPopover(false);
    }
  };

  const handleSelectMention = (username: string) => {
    if(!textareaRef.current) return;
    
    const currentValue = textareaRef.current.value;
    const atIndex = currentValue.lastIndexOf('@');
    const newValue = `${currentValue.substring(0, atIndex)}@${username} `;
    
    setCaption(newValue);
    setMentions((prev) => [...prev, username]);
    setShowMentionPopover(false);

    // Focus back on the textarea
    textareaRef.current.focus();
  };

  // Extract hashtags and mentions
  useEffect(() => {
    const mentions = caption.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];
    const hashtags = caption.match(/#(\w+)/g)?.map(h => h.substring(1)) || [];
    setMentions(mentions);
    setHashtags(hashtags);
  }, [caption, setMentions, setHashtags]);

  return (
    <div>
        <Popover open={showMentionPopover} onOpenChange={setShowMentionPopover}>
            <PopoverTrigger asChild>
                <TextareaAutosize
                    ref={textareaRef}
                    placeholder={mode === 'story' ? 'Add a caption... (optional)' : 'Write a caption...'}
                    className="w-full bg-transparent text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none resize-none p-0"
                    minRows={3}
                    maxRows={8}
                    value={caption}
                    onChange={handleInputChange}
                />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="space-y-1">
                    {dummyUsers
                        .filter(u => u.username.toLowerCase().includes(mentionQuery.toLowerCase()))
                        .slice(0, 5)
                        .map(user => (
                            <button key={user.id} onClick={() => handleSelectMention(user.username)} className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                               <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} />
                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <div>
                                    <p className="font-semibold text-sm">{user.username}</p>
                                    <p className="text-xs text-muted-foreground">{user.fullName}</p>
                               </div>
                            </button>
                        ))
                    }
                </div>
            </PopoverContent>
        </Popover>

      {charLimit && (
        <p className={cn("text-xs text-right mt-1", caption.length >= charLimit ? "text-destructive" : "text-muted-foreground")}>
          {caption.length} / {charLimit}
        </p>
      )}
    </div>
  );
}
