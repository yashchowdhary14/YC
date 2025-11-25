'use client';

import { Grid3x3, Clapperboard, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabSwitcherProps {
  postsContent: React.ReactNode;
  reelsContent: React.ReactNode;
  taggedContent: React.ReactNode;
}

export default function TabSwitcher({ postsContent, reelsContent, taggedContent }: TabSwitcherProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">
          <Grid3x3 className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="reels">
          <Clapperboard className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Reels</span>
        </TabsTrigger>
        <TabsTrigger value="tagged">
          <Tag className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Tagged</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-4">
        {postsContent}
      </TabsContent>
      <TabsContent value="reels" className="mt-4">
        {reelsContent}
      </TabsContent>
      <TabsContent value="tagged" className="mt-4">
        {taggedContent}
      </TabsContent>
    </Tabs>
  );
}
