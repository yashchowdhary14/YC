
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, Image as ImageIcon, Search, Trash2, UserMinus } from 'lucide-react';
import type { User } from '@/lib/types';

interface ChatDetailsProps {
    partner: User;
}

export default function ChatDetails({ partner }: ChatDetailsProps) {
    return (
        <div className="h-full flex flex-col border-l bg-background">
            <div className="p-6 flex flex-col items-center border-b">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={partner.avatarUrl} alt={partner.username} />
                    <AvatarFallback>{partner.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{partner.fullName}</h2>
                <p className="text-muted-foreground">@{partner.username}</p>
                <div className="flex gap-4 mt-4">
                    <Button variant="secondary" size="sm">Profile</Button>
                    <Button variant="secondary" size="sm">Mute</Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Settings</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <span>Mute Messages</span>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <span>Search in Conversation</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Shared Media */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shared Media</h3>
                            <Button variant="link" size="sm" className="h-auto p-0">See All</Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-4 w-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Danger Zone */}
                    <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3">
                            <UserMinus className="h-5 w-5" />
                            Block User
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3">
                            <Trash2 className="h-5 w-5" />
                            Delete Chat
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
