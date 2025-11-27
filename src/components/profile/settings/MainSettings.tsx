
'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, UserCircle, Settings, Globe, Star, Shield, HelpCircle, Info, Heart, Clock, Bookmark, Bell, MessageCircle, GitBranch, Share } from 'lucide-react';
import Link from 'next/link';
import type { SettingsViewProps } from './types';


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
            { label: "Likes", icon: Heart, href: "/account/edit?tab=liked" },
            { label: "Archive", icon: Clock, view: 'archive' },
            { label: "Your activity", icon: Heart, view: 'activity' },
            { label: "Notifications", icon: Bell, view: 'notifications' },
            { label: "Time spent", icon: Clock, view: 'activity' },
        ]
    },
    {
        title: "Who can see your content",
        items: [
            { label: "Account privacy", icon: Shield, view: 'privacy' },
            { label: "Close Friends", icon: UserCircle },
            { label: "Blocked", icon: Shield },
            { label: "Hide story and live", icon: Shield },
        ]
    },
     {
        title: "How others can interact with you",
        items: [
            { label: "Messages and story replies", icon: MessageCircle, view: 'interactions' },
            { label: "Tags and mentions", icon: UserCircle, view: 'interactions' },
            { label: "Comments", icon: MessageCircle, view: 'interactions' },
            { label: "Sharing and remixes", icon: Share, view: 'interactions' },
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
            { label: "Like and share counts", icon: Heart, view: 'interactions' },
        ]
    },
     {
        title: "Your app and media",
        items: [
            { label: "Device permissions", icon: Settings, view: 'appAndMedia' },
            { label: "Archiving and downloading", icon: Settings, view: 'archive' },
            { label: "Accessibility", icon: Settings },
            { label: "Language", icon: Globe, view: 'appAndMedia' },
            { label: "Data usage and media quality", icon: GitBranch, view: 'appAndMedia' },
            { label: "Website permissions", icon: Globe },
        ]
    },
    {
        title: "For professionals",
        items: [
            { label: "Creator tools and controls", icon: Star },
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

export default function MainSettings({ setView, onClose }: SettingsViewProps) {

  const handleItemClick = (item: any) => {
    if (item.view) {
      setView(item.view);
    } else if (item.href) {
      onClose(); // Close the sheet for external navigation
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">Settings and activity</h2>
      </div>
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
                    return <Link href={item.href} key={item.label} onClick={() => handleItemClick(item)}>{content}</Link>;
                  }

                  return <button key={item.label} className="w-full" onClick={() => handleItemClick(item)}>{content}</button>;
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
