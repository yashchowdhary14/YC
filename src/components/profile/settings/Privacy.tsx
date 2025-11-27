
'use client';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';
import { useState } from 'react';

const privacyItems = [
    { id: 'closeFriends', label: "Close Friends", value: "0" },
    { id: 'blocked', label: "Blocked", value: "0" },
    { id: 'hideStory', label: "Hide story and live" },
];


export default function Privacy({ setView }: SettingsViewProps) {
    const [isPrivate, setIsPrivate] = useState(false);

    return (
        <div className="h-full flex flex-col bg-background">
            <header className="flex items-center p-4 border-b flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setView('main')}>
                <ArrowLeft />
                </Button>
                <h2 className="text-xl font-bold ml-4">Account privacy</h2>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <div className="flex items-start justify-between p-4 border rounded-lg bg-secondary/30">
                        <div>
                            <Label htmlFor="private-account" className="font-semibold text-base">Private account</Label>
                             <p className="text-sm text-muted-foreground mt-1 pr-4">When your account is private, only people you approve can see your photos and videos on YCP.</p>
                        </div>
                        <Switch
                            id="private-account"
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                        />
                    </div>
                    
                    <div className="border-t pt-4">
                         <h3 className="text-muted-foreground font-semibold px-2 mb-2 text-sm">Interactions</h3>
                         {privacyItems.map(item => (
                            <button key={item.id} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                                <p className="font-medium">{item.label}</p>
                                <div className="flex items-center gap-2">
                                    {item.value && <span className="text-muted-foreground">{item.value}</span>}
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
