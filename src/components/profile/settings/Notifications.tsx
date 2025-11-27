
'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';
import { useState } from 'react';

const notificationCategories = [
    { id: 'posts', label: "Posts, stories and comments" },
    { id: 'following', label: "Following and followers" },
    { id: 'messages', label: "Messages" },
    { id: 'live', label: "Live" },
];


export default function Notifications({ setView }: SettingsViewProps) {
    const [pauseAll, setPauseAll] = useState(false);

    return (
        <div className="h-full flex flex-col bg-background">
            <header className="flex items-center p-4 border-b flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setView('main')}>
                <ArrowLeft />
                </Button>
                <h2 className="text-xl font-bold ml-4">Notifications</h2>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/30">
                        <div>
                            <Label htmlFor="pause-all" className="font-semibold text-base">Pause all</Label>
                        </div>
                        <Switch
                            id="pause-all"
                            checked={pauseAll}
                            onCheckedChange={setPauseAll}
                        />
                    </div>

                    {notificationCategories.map(cat => (
                         <div key={cat.id} className="flex items-center justify-between p-4 border-b">
                            <p className="font-medium">{cat.label}</p>
                            <p className="text-muted-foreground text-sm">Off</p>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
