
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, Bookmark, Lock, Heart } from 'lucide-react';
import type { ActiveTab } from '@/app/account/edit/page';

interface DashboardNavProps {
    activeTab: string;
    setActiveTab: (tab: ActiveTab) => void;
}

const navSections = [
    {
        title: "Your Account",
        items: [
             { id: 'edit', label: 'Edit Profile', icon: User },
        ]
    },
    {
        title: "How You Use YCP",
        items: [
            { id: 'saved', label: 'Saved', icon: Bookmark },
            { id: 'liked', label: 'Likes', icon: Heart },
        ]
    },
    {
        title: "Who Can See Your Content",
        items: [
            { id: 'privacy', label: 'Account Privacy', icon: Lock },
        ]
    }
]

export default function DashboardNav({ activeTab, setActiveTab }: DashboardNavProps) {
    return (
        <nav className="flex flex-col gap-4">
            {navSections.map(section => (
                <div key={section.title}>
                    <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.title}</h3>
                    <div className="flex flex-row md:flex-col gap-1">
                        {section.items.map(item => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    'w-full justify-start gap-3',
                                    activeTab === item.id && 'bg-accent font-semibold'
                                )}
                                onClick={() => setActiveTab(item.id as ActiveTab)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="hidden md:inline">{item.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
}
