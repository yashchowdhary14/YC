'use client';

import { Suspense } from 'react';
import { Grid3x3, Clapperboard, Tag, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabSwitcherProps {
  postsContent: React.ReactNode;
  reelsContent: React.ReactNode;
  taggedContent: React.ReactNode;
}

function TabContentWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            {children}
        </Suspense>
    )
}

export default function TabSwitcher({ postsContent, reelsContent, taggedContent }: TabSwitcherProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto rounded-none">
        <TabsTrigger value="posts" className="py-3 rounded-none border-b data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
          <Grid3x3 className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">POSTS</span>
        </TabsTrigger>
        <TabsTrigger value="reels" className="py-3 rounded-none border-b data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
          <Clapperboard className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">REELS</span>
        </TabsTrigger>
        <TabsTrigger value="tagged" className="py-3 rounded-none border-b data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
          <Tag className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">TAGGED</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-4">
        <TabContentWrapper>{postsContent}</TabContentWrapper>
      </TabsContent>
      <TabsContent value="reels" className="mt-4">
        <TabContentWrapper>{reelsContent}</TabContentWrapper>
      </TabsContent>
      <TabsContent value="tagged" className="mt-4">
        <TabContentWrapper>{taggedContent}</TabContentWrapper>
      </TabsContent>
    </Tabs>
  );
}
