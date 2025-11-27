'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronRight, Heart, Bookmark, Clock, Star, Shield, HelpCircle, Info, Settings, Search, UserCircle, Globe } from 'lucide-react';
import Link from 'next/link';

interface SettingsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuSections = [
    {
        title: "Your Account",
        items: [
            { label: "Accounts Center", icon: UserCircle, href: "/account/edit" },
        ]
    },
    {
        title: "How you use YCP",
        items: [
            { label: "Saved", icon: Bookmark, href: "/account/edit?tab=saved" },
            { label: "Archive", icon: Clock },
            { label: "Your activity", icon: Heart },
            { label: "Notifications", icon: Heart },
            { label: "Time spent", icon: Clock },
        ]
    },
    {
        title: "For professionals",
        items: [
            { label: "Creator tools and controls", icon: Star },
        ]
    },
     {
        title: "Who can see your content",
        items: [
            { label: "Account privacy", icon: Shield },
            { label: "Close Friends", icon: UserCircle },
            { label: "Blocked", icon: Shield },
            { label: "Hide story and live", icon: Shield },
        ]
    },
     {
        title: "How others can interact with you",
        items: [
            { label: "Messages and story replies", icon: Shield },
            { label: "Tags and mentions", icon: Shield },
            { label: "Comments", icon: Shield },
            { label: "Sharing and remixes", icon: Shield },
            { label: "Restricted accounts", icon: Shield },
            { label: "Limit interactions", icon: Shield },
            { label: "Hidden Words", icon: Shield },
        ]
    },
     {
        title: "What you see",
        items: [
            { label: "Favorites", icon: Star },
            { label: "Muted accounts", icon: Shield },
            { label: "Suggested content", icon: Globe },
            { label: "Like and share counts", icon: Heart },
        ]
    },
     {
        title: "Your app and media",
        items: [
            { label: "Device permissions", icon: Settings },
            { label: "Archiving and downloading", icon: Settings },
            { label: "Accessibility", icon: Settings },
            { label: "Language", icon: Globe },
            { label: "Data usage and media quality", icon: Settings },
            { label: "Website permissions", icon: Globe },
        ]
    },
     {
        title: "More info and support",
        items: [
            { label: "Help", icon: HelpCircle },
            { label: "Account Status", icon: Info },
            { label: "About", icon: Info },
        ]
    }
];

export default function SettingsSheet({ isOpen, onOpenChange }: SettingsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-2xl font-bold">Settings and activity</SheetTitle>
        </SheetHeader>
        <div className="p-4 border-b">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search settings" className="pl-10 bg-secondary border-none" />
            </div>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
                {menuSections.map(section => (
                    <div key={section.title}>
                        <h3 className="text-base font-semibold px-2 mb-2">{section.title}</h3>
                        <div className="space-y-1">
                            {section.items.map(item => {
                                const content = (
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors w-full text-left">
                                        <div className="flex items-center gap-4">
                                            <item.icon className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-base">{item.label}</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                );
                                if (item.href) {
                                    return <Link href={item.href} key={item.label} onClick={() => onOpenChange(false)}>{content}</Link>;
                                }
                                return <button key={item.label} className="w-full">{content}</button>
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
