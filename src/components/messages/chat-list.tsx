
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Chat, User } from '@/lib/types';
import ChatListItem from './chat-list-item';
import { Input } from '../ui/input';
import { Loader2, Search } from 'lucide-react';
<<<<<<< HEAD
import { cn, debounce } from '@/lib/utils';
=======
import { cn } from '@/lib/utils';
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { dummyUsers } from '@/lib/dummy-data';

function NewMessageDialog({ onChatSelected }: { onChatSelected: (chat: Chat) => void }) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
<<<<<<< HEAD
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
=======
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const { user: currentUser } = useUser();
    const router = useRouter();

<<<<<<< HEAD
    // Debounce the search
    useEffect(() => {
        const handler = debounce((term: string) => {
            setDebouncedSearchTerm(term);
        }, 300);
        handler(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm.trim().length < 1) {
            setSearchResults([]);
            return;
        }
        const users = dummyUsers.filter(u =>
            u.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) && u.id !== currentUser?.uid
        ).map(u => ({ ...u, avatarUrl: `https://picsum.photos/seed/${u.id}/100/100` }));
        setSearchResults(users);
    }, [debouncedSearchTerm, currentUser]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
=======
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.trim().length < 1) {
            setSearchResults([]);
            return;
        }
        const users = dummyUsers.filter(u => 
            u.username.toLowerCase().includes(term.toLowerCase()) && u.id !== currentUser?.uid
        ).map(u => ({...u, avatarUrl: `https://picsum.photos/seed/${u.id}/100/100`}));
        setSearchResults(users);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    };

    const handleSelectUser = (targetUser: User) => {
        if (!currentUser) return;
        setOpen(false);
        const sortedIds = [currentUser.uid, targetUser.id].sort();
        const chatId = sortedIds.join('_');
        router.push(`/chat/${chatId}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <svg aria-label="New message" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.543a3 3 0 0 0 3-3V11.85a3.003 3.003 0 0 0-.748-1.921L14.12 4.93a3 3 0 0 0-1.918-1.727Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M10.426 18.252a1.5 1.5 0 1 0 3.001 0 1.5 1.5 0 0 0-3.001 0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.75 3.25h-5.467a3 3 0 0 1-2.6-1.5L9.6 1.25H4.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.543a3 3 0 0 0 3-3V6.25a3 3 0 0 0-3-3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <Input
                        placeholder="Search for people..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <ScrollArea className="max-h-64">
                    <div className="space-y-2">
                        {searchResults.map(user => (
                            <div key={user.id} onClick={() => handleSelectUser(user)} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                                <Avatar>
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-sm text-muted-foreground">{user.fullName}</p>
                                </div>
                            </div>
                        ))}
<<<<<<< HEAD
                        {searchTerm && searchResults.length === 0 && (
=======
                         {searchTerm && searchResults.length === 0 && (
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
                            <div className="text-center text-muted-foreground p-4">
                                <p>No results found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

interface ChatListProps {
<<<<<<< HEAD
    chats: Chat[];
    selectedChat: Chat | null;
    onSelectChat: (chat: Chat) => void;
    isMobile?: boolean;
}

export default function ChatList({ chats, selectedChat, onSelectChat, isMobile }: ChatListProps) {
    const [filter, setFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const handler = debounce((term: string) => {
            setDebouncedFilter(term);
        }, 300);
        handler(filter);
    }, [filter]);

    const filteredChats = chats.filter(chat => {
        const partner = chat.userDetails?.find(u => u.id !== 'current_user_id'); // dummy id
        if (!partner) return false;
        return partner.username.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
            (partner.fullName && partner.fullName.toLowerCase().includes(debouncedFilter.toLowerCase()));
    });

    return (
        <div className="flex flex-col h-full">
            {!isMobile && (
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">Messages</h1>
                        <NewMessageDialog onChatSelected={onSelectChat} />
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search messages..."
                            className="pl-8 bg-muted border-none"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <ScrollArea className="flex-1">
                <div className={cn(!isMobile && 'p-2')}>
                    {filteredChats.map((chat) => (
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
=======
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  isMobile?: boolean;
}

export default function ChatList({ chats, selectedChat, onSelectChat, isMobile }: ChatListProps) {
  const [filter, setFilter] = useState('');
  
  const filteredChats = chats.filter(chat => {
    const partner = chat.userDetails?.find(u => u.id !== 'current_user_id'); // dummy id
    if (!partner) return false;
    return partner.username.toLowerCase().includes(filter.toLowerCase()) || 
           (partner.fullName && partner.fullName.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <div className="flex flex-col h-full">
      {!isMobile && (
        <div className="p-4 border-b">
           <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Messages</h1>
              <NewMessageDialog onChatSelected={onSelectChat} />
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search messages..." 
                    className="pl-8 bg-muted border-none" 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className={cn(!isMobile && 'p-2')}>
          {filteredChats.map((chat) => (
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
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
}
