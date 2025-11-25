'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Chat } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ChatListItem({ chat, isSelected, onSelect }: ChatListItemProps) {
  const user = chat.users[0]; // Assuming one-on-one chat
  const lastMessage = chat.lastMessage;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent',
        isSelected && 'bg-accent'
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold truncate">{user.fullName}</p>
          {lastMessage && (
             <time className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {formatDistanceToNow(lastMessage.timestamp, { addSuffix: true })}
            </time>
          )}
        </div>
        {lastMessage && (
            <div className="flex items-center">
                <p className={cn(
                    'text-sm text-muted-foreground truncate',
                    !lastMessage.isRead && 'text-foreground font-medium'
                )}>
                    {lastMessage.text}
                </p>
                {!lastMessage.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary ml-auto flex-shrink-0"></div>
                )}
            </div>
        )}
      </div>
    </button>
  );
}
