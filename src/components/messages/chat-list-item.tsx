
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Chat } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/firebase';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ChatListItem({ chat, isSelected, onSelect }: ChatListItemProps) {
  const { user: currentUser } = useUser();
  const partner = chat.userDetails?.find(u => u.id !== currentUser?.uid);
  const lastMessage = chat.lastMessage;

  if (!partner) {
    // This could be a group chat or a chat where the user is alone.
    // Or data is still loading.
    return (
        <div className="flex w-full items-center gap-3 p-4 text-left">
            <Avatar className="h-12 w-12">
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
                <p className="font-semibold truncate">Loading chat...</p>
            </div>
        </div>
    );
  }

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent',
        isSelected && 'bg-accent'
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={partner.avatarUrl} alt={partner.username} />
        <AvatarFallback>{partner.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold truncate">{partner.fullName}</p>
          {lastMessage?.timestamp && (
             <time className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {formatDistanceToNow( (lastMessage.timestamp as any).toDate ? (lastMessage.timestamp as any).toDate() : new Date(lastMessage.timestamp), { addSuffix: true })}
            </time>
          )}
        </div>
        {lastMessage && (
            <div className="flex items-center">
                <p className={cn(
                    'text-sm text-muted-foreground truncate',
                    !lastMessage.isRead && lastMessage.senderId !== currentUser?.uid && 'text-foreground font-medium'
                )}>
                    {lastMessage.text}
                </p>
                {!lastMessage.isRead && lastMessage.senderId !== currentUser?.uid && (
                    <div className="h-2 w-2 rounded-full bg-primary ml-auto flex-shrink-0"></div>
                )}
            </div>
        )}
      </div>
    </button>
  );
}
