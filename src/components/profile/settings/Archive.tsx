
'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';

// Placeholder components for different archive types
const StoriesArchive = () => <div className="p-4 text-center text-muted-foreground">Stories archive coming soon.</div>
const PostsArchive = () => <div className="p-4 text-center text-muted-foreground">Posts archive coming soon.</div>
const LiveArchive = () => <div className="p-4 text-center text-muted-foreground">Live archive coming soon.</div>

export default function Archive({ setView }: SettingsViewProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex items-center p-4 border-b flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => setView('main')}>
          <ArrowLeft />
        </Button>
        <h2 className="text-xl font-bold ml-4">Archive</h2>
      </header>

      <Tabs defaultValue="stories" className="flex-1 flex flex-col">
        <TabsList className="m-4">
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="stories" className="m-0">
            <StoriesArchive />
          </TabsContent>
          <TabsContent value="posts" className="m-0">
            <PostsArchive />
          </TabsContent>
          <TabsContent value="live" className="m-0">
            <LiveArchive />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

    