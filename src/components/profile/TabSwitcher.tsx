
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
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto rounded-none text-muted-foreground uppercase text-xs tracking-widest">
        <TabsTrigger value="posts" className="py-3 rounded-none border-b data-[state=active]:border-t data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none -mt-px">
          <Grid3x3 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="reels" className="py-3 rounded-none border-b data-[state=active]:border-t data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none -mt-px">
          <Clapperboard className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Reels</span>
        </TabsTrigger>
        <TabsTrigger value="tagged" className="py-3 rounded-none border-b data-[state=active]:border-t data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none -mt-px">
          <Tag className="h-4 w-4 sm:mr-2" />
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
