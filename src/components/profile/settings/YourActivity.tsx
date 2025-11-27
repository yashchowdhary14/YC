
'use client';

import { ArrowLeft, ChevronRight, Clock, Heart, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SettingsViewProps } from './types';
import ContentActivity from './ContentActivity';
import InteractionsActivity from './InteractionsActivity';
import TimeSpent from './TimeSpent';


export default function YourActivity({ setView }: SettingsViewProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex items-center p-4 border-b flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => setView('main')}>
          <ArrowLeft />
        </Button>
        <h2 className="text-xl font-bold ml-4">Your activity</h2>
      </header>
      
      <Tabs defaultValue="time" className="flex-1 flex flex-col">
        <TabsList className="m-4">
          <TabsTrigger value="time">Time Spent</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="time" className="m-0 p-4">
            <TimeSpent />
          </TabsContent>
          <TabsContent value="content" className="m-0">
            <ContentActivity />
          </TabsContent>
          <TabsContent value="interactions" className="m-0">
            <InteractionsActivity />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

    