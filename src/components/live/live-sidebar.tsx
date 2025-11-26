
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import type { Stream, Category } from '@/lib/types';
import Link from 'next/link';
import { formatCompactNumber } from '@/lib/utils';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from '../ui/sidebar';

interface LiveSidebarProps {
  recommendedChannels: Stream[];
  recommendedCategories: Category[];
}

function ChannelItem({ channel }: { channel: Stream }) {
  const { setOpen } = useSidebar();
  return (
    <Link 
      href={`/${channel.user.username}`} 
      className="flex items-center gap-3 px-2 py-1.5 hover:bg-zinc-700 rounded-md"
      onClick={() => setOpen(false)}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={channel.user.avatarUrl} alt={channel.user.username} />
        <AvatarFallback>{channel.user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate">{channel.user.username}</p>
        <p className="text-xs text-zinc-400 truncate">{channel.category}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span>{formatCompactNumber(channel.viewerCount)}</span>
      </div>
    </Link>
  );
}

function CategoryItem({ category }: { category: Category }) {
    const { setOpen } = useSidebar();
    return (
     <Link 
        href={`/live/category/${category.id}`} 
        className="flex items-center gap-3 px-2 py-1.5 hover:bg-zinc-700 rounded-md"
        onClick={() => setOpen(false)}
    >
      <div className="w-8 h-10 bg-zinc-700 rounded-sm overflow-hidden shrink-0">
        <img src={category.thumbnailUrl} alt={category.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate">{category.name}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span>{formatCompactNumber(Math.floor(Math.random() * 100000))}</span>
      </div>
    </Link>
    )
}


export default function LiveSidebar({ recommendedChannels, recommendedCategories }: LiveSidebarProps) {
  return (
    <Sidebar className="p-0 border-r border-r-zinc-800 bg-zinc-900 text-white" side="left">
        <SidebarHeader className="h-[3.5rem] md:h-14 border-b border-zinc-800 flex items-center justify-between px-4">
            <h2 className="text-lg font-bold">For You</h2>
        </SidebarHeader>
        <SidebarContent className="py-2">
            <div className="p-2">
                <h3 className="text-sm font-semibold uppercase text-zinc-400 px-2 mb-2">Recommended Categories</h3>
                <div className="space-y-1">
                    {recommendedCategories.map(category => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
                    <Button variant="link" size="sm" className="text-xs p-0 text-primary">Show More</Button>
                </div>
            </div>
            <Separator className="my-2 bg-zinc-700"/>
            <div className="p-2">
                <h3 className="text-sm font-semibold uppercase text-zinc-400 px-2 mb-2">Live Channels</h3>
                <div className="space-y-1">
                    {recommendedChannels.map(channel => (
                        <ChannelItem key={channel.id} channel={channel} />
                    ))}
                    <Button variant="link" size="sm" className="text-xs p-0 text-primary">Show More</Button>
                </div>
            </div>
        </SidebarContent>
    </Sidebar>
  );
}
