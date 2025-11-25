'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Chat } from '@/lib/types';
import ChatListItem from './chat-list-item';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  isMobile?: boolean;
}

export default function ChatList({ chats, selectedChat, onSelectChat, isMobile }: ChatListProps) {
  return (
    <div className="flex flex-col h-full">
      {!isMobile && (
        <div className="p-4 border-b">
           <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Messages</h1>
              <Button variant="ghost" size="icon">
                  <svg aria-label="New message" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.543a3 3 0 0 0 3-3V11.85a3.003 3.003 0 0 0-.748-1.921L14.12 4.93a3 3 0 0 0-1.918-1.727Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M10.426 18.252a1.5 1.5 0 1 0 3.001 0 1.5 1.5 0 0 0-3.001 0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.75 3.25h-5.467a3 3 0 0 1-2.6-1.5L9.6 1.25H4.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.543a3 3 0 0 0 3-3V6.25a3 3 0 0 0-3-3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </Button>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-8 bg-muted border-none" />
            </div>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className={cn(!isMobile && 'p-2')}>
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
