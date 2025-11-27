
'use client';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';
import { useState } from 'react';

const interactionItems = [
    { id: 'tags', label: "Tags and mentions", value: "Allow tags from everyone" },
    { id: 'comments', label: "Comments", value: "Allow comments from everyone" },
    { id: 'sharing', label: "Sharing and remixes" },
    { id: 'restricted', label: "Restricted accounts" },
    { id: 'hiddenWords', label: "Hidden Words" },
    { id: 'hideLikes', label: "Hide like and share counts" },
];


export default function Interactions({ setView }: SettingsViewProps) {
    const [showActivity, setShowActivity] = useState(true);

    return (
        <div className="h-full flex flex-col bg-background">
            <header className="flex items-center p-4 border-b flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setView('main')}>
                <ArrowLeft />
                </Button>
                <h2 className="text-xl font-bold ml-4">How others can interact</h2>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                     <div className="flex items-start justify-between p-3 rounded-lg hover:bg-accent">
                        <div>
                            <Label htmlFor="activity-status" className="font-semibold text-base">Show activity status</Label>
                            <p className="text-sm text-muted-foreground mt-1 pr-4">Allow accounts you follow and anyone you message to see when you were last active or are currently active.</p>
                        </div>
                        <Switch
                            id="activity-status"
                            checked={showActivity}
                            onCheckedChange={setShowActivity}
                        />
                    </div>
                    {interactionItems.map(item => (
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
