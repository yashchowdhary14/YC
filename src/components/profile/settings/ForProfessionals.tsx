'use client';

import { ArrowLeft, ChevronRight, Star, Briefcase, BarChart2, MessageSquareQuote, Link, ShieldCheck, UserCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SettingsViewProps } from './types';

const professionalItems = [
    { id: 'ads', label: "Ad tools", icon: Briefcase },
    { id: 'branded', label: "Branded content", icon: Star },
    { id: 'partnerships', label: "Partnership ads", icon: BarChart2 },
    { id: 'replies', label: "Response suggestions", icon: MessageSquareQuote },
    { id: 'facebook', label: "Connect or create", icon: Link },
    { id: 'age', label: "Minimum age", icon: ShieldCheck },
    { id: 'monetization', label: "Monetization status", icon: UserCheck },
    { id: 'switchAccount', label: "Switch account type", icon: Settings },
    { id: 'verification', label: "Request verification", icon: UserCheck },
];


export default function ForProfessionals({ setView }: SettingsViewProps) {
    return (
        <div className="h-full flex flex-col bg-background">
            <header className="flex items-center p-4 border-b flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setView('main')}>
                <ArrowLeft />
                </Button>
                <h2 className="text-xl font-bold ml-4">For professionals</h2>
            </header>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {professionalItems.map(item => (
                        <button key={item.id} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                            <div className="flex items-center gap-4">
                                <item.icon className="h-6 w-6 text-muted-foreground" />
                                <p className="font-medium">{item.label}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
