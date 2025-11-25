'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Chat } from '@/lib/types';
import ChatListItem from './chat-list-item';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  isMobile?: boolean;
}

export default function ChatList({ chats, selectedChat, onSelectChat, isMobile }: ChatListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className={cn('p-4 border-b', isMobile && 'border-none')}>
        <div className={cn('relative', !isMobile && 'mt-4')}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-8" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div>
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={() => onSelectChat(chat)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
