
'use client';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';
import { useState } from 'react';
import { useTheme } from 'next-themes';

const mediaSettings = [
    { id: 'language', label: "Language", value: "English" },
    { id: 'permissions', label: "Device permissions" },
];


export default function AppAndMedia({ setView }: SettingsViewProps) {
    const { theme, setTheme } = useTheme();
    const [useLessData, setUseLessData] = useState(false);
    const [highQuality, setHighQuality] = useState(false);

    return (
        <div className="h-full flex flex-col bg-background">
            <header className="flex items-center p-4 border-b flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setView('main')}>
                <ArrowLeft />
                </Button>
                <h2 className="text-xl font-bold ml-4">Your app and media</h2>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <div className="border-b pb-4">
                         {mediaSettings.map(item => (
                            <button key={item.id} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                                <p className="font-medium">{item.label}</p>
                                <div className="flex items-center gap-2">
                                    {item.value && <span className="text-muted-foreground text-sm">{item.value}</span>}
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-3">
                         <h3 className="text-muted-foreground font-semibold mb-2 text-sm">Data usage</h3>
                         <div className="flex items-start justify-between p-3 rounded-lg hover:bg-accent">
                            <div>
                                <Label htmlFor="less-data" className="font-semibold text-base">Use less cellular data</Label>
                                <p className="text-sm text-muted-foreground mt-1 pr-4">When this is on, videos won't load in advance to help you use less data.</p>
                            </div>
                            <Switch
                                id="less-data"
                                checked={useLessData}
                                onCheckedChange={setUseLessData}
                            />
                        </div>
                    </div>
                     <div className="p-3">
                         <h3 className="text-muted-foreground font-semibold mb-2 text-sm">Media quality</h3>
                         <div className="flex items-start justify-between p-3 rounded-lg hover:bg-accent">
                            <div>
                                <Label htmlFor="high-quality" className="font-semibold text-base">Upload at highest quality</Label>
                                <p className="text-sm text-muted-foreground mt-1 pr-4">Always upload the highest quality photos and videos, even if uploading takes longer.</p>
                            </div>
                            <Switch
                                id="high-quality"
                                checked={highQuality}
                                onCheckedChange={setHighQuality}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
