'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, Bookmark, Lock } from 'lucide-react';

interface DashboardNavProps {
    activeTab: string;
    setActiveTab: (tab: 'edit' | 'saved' | 'privacy') => void;
}

export default function DashboardNav({ activeTab, setActiveTab }: DashboardNavProps) {
    const navItems = [
        { id: 'edit', label: 'Edit Profile', icon: User },
        { id: 'saved', label: 'Saved', icon: Bookmark },
        { id: 'privacy', label: 'Privacy and Security', icon: Lock },
    ];

    return (
        <nav className="flex flex-row md:flex-col gap-1">
            {navItems.map(item => (
                <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                        'w-full justify-start gap-3',
                        activeTab === item.id && 'bg-accent'
                    )}
                    onClick={() => setActiveTab(item.id as any)}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="hidden md:inline">{item.label}</span>
                </Button>
            ))}
        </nav>
    );
}
