'use client';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';

const whatYouSeeItems = [
    { id: 'favorites', label: "Favorites", value: "0" },
    { id: 'muted', label: "Muted accounts", value: "0" },
    { id: 'suggested', label: "Suggested content" },
    { id: 'likes', label: "Like and share counts" },
];


export default function WhatYouSee({ setView }: SettingsViewProps) {
    return (
        <div className="h-full flex flex-col bg-background">
            <header className="flex items-center p-4 border-b flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setView('main')}>
                <ArrowLeft />
                </Button>
                <h2 className="text-xl font-bold ml-4">What you see</h2>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {whatYouSeeItems.map(item => (
                        <button key={item.id} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                            <p className="font-medium">{item.label}</p>
                            <div className="flex items-center gap-2">
                                {item.value && <span className="text-muted-foreground text-sm">{item.value}</span>}
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
