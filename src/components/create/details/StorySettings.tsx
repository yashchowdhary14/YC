
'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { FinalizedCreateData } from '../types';

interface StorySettingsProps {
    settings: FinalizedCreateData['settings'];
    setSettings: (settings: FinalizedCreateData['settings']) => void;
}

export default function StorySettings({ settings, setSettings }: StorySettingsProps) {
  const isCloseFriends = settings.storyAudience === 'close-friends';
  
  const handleToggle = (checked: boolean) => {
    setSettings({ ...settings, storyAudience: checked ? 'close-friends' : 'everyone' });
  };

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between p-2 -mx-2 rounded-md bg-green-500/10 border border-green-500/30">
          <div>
            <Label htmlFor="close-friends-toggle" className="font-semibold text-green-300">Close Friends</Label>
            <p className="text-xs text-green-400/80 pr-4">Share this story only with people on your close friends list.</p>
          </div>
          <Switch
            id="close-friends-toggle"
            checked={isCloseFriends}
            onCheckedChange={handleToggle}
          />
        </div>

        <Button variant="ghost" className="w-full justify-between p-2 -mx-2 h-auto">
            <div className="text-left">
                <p className="font-medium">Hide story from</p>
                <p className="text-xs text-muted-foreground">0 people</p>
            </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
    </div>
  );
}
