'use client';

import { Grid3x3, Clapperboard, UserSquare2 } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabSwitcher() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="posts" className="gap-2">
          <Grid3x3 className="h-5 w-5" />
          <span className="hidden sm:inline">POSTS</span>
        </TabsTrigger>
        <TabsTrigger value="reels" className="gap-2">
          <Clapperboard className="h-5 w-5" />
          <span className="hidden sm:inline">REELS</span>
        </TabsTrigger>
        <TabsTrigger value="tagged" className="gap-2">
          <UserSquare2 className="h-5 w-5" />
          <span className="hidden sm:inline">TAGGED</span>
        </TabsTrigger>
      </TabsList>
      {/* 
        The TabsContent components will be added later. 
        For now, the PostsGrid component is displayed directly below this TabSwitcher.
        We will later move PostsGrid inside a TabsContent.
      */}
    </Tabs>
  );
}
