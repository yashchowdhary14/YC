
'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Chat, User } from '@/lib/types';
import ChatListItem from './chat-list-item';
import { Input } from '../ui/input';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, limit, getDocs, doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


function NewMessageDialog({ onChatSelected }: { onChatSelected: (chat: Chat) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const firestore = useFirestore();
    const { user: currentUser } = useUser();

    const handleSearch = async (term: string) => {
        if (!firestore || !currentUser) return;
        setSearchTerm(term);
        if (term.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const usersRef = collection(firestore, 'users');
        // Simple search - in a real app, use a dedicated search service like Algolia
        const q = query(usersRef, where('username', '>=', term), where('username', '<=', term + '\uf8ff'), limit(10));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data() as User).filter(u => u.id !== currentUser.uid);
        setSearchResults(users);
        setIsSearching(false);
    };

    const handleSelectUser = async (targetUser: User) => {
        if (!currentUser || !firestore) return;
        setIsCreatingChat(true);

        const sortedIds = [currentUser.uid, targetUser.id].sort();
        const chatId = sortedIds.join('_');
        const chatRef = doc(firestore, 'chats', chatId);

        // Check if chat already exists
        const chatQuery = query(collection(firestore, 'chats'), where('id', '==', chatId), limit(1));
        const chatSnapshot = await getDocs(chatQuery);
        
        let selectedChat: Chat;

        if (chatSnapshot.empty) {
            // Create a new chat and add sample messages
            const batch = writeBatch(firestore);

            const newChatData = {
                id: chatId,
                users: sortedIds,
                lastUpdated: serverTimestamp(),
                // userDetails will be hydrated by the useHydratedChats hook
            };
            batch.set(chatRef, newChatData);

            // Add a few sample messages to make the chat feel alive
            const messagesRef = collection(firestore, 'chats', chatId, 'messages');
            
            const firstMessageRef = doc(messagesRef);
            batch.set(firstMessageRef, {
                id: firstMessageRef.id,
                chatId: chatId,
                senderId: targetUser.id, // From the other user
                text: "Hey! 👋",
                timestamp: serverTimestamp(),
                isRead: false,
            });

            const secondMessageRef = doc(messagesRef);
            batch.set(secondMessageRef, {
                id: secondMessageRef.id,
                chatId: chatId,
                senderId: currentUser.uid, // From the current user
                text: "How's it going?",
                timestamp: serverTimestamp(),
                isRead: true, // Mark our own message as read
            });

            // Update last message on the chat document
            batch.update(chatRef, {
                lastMessage: {
                    text: "How's it going?",
                    timestamp: serverTimestamp(),
                    senderId: currentUser.uid,
                }
            });
            
            await batch.commit();

            selectedChat = { ...newChatData, userDetails: [targetUser] } as Chat;
        } else {
             // Chat already exists
            selectedChat = chatSnapshot.docs[0].data() as Chat;
        }

        onChatSelected(selectedChat);
        setIsCreatingChat(false);
    };

    return (
        <Dialog>
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
                    {isSearching && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
                </div>
                <ScrollArea className="max-h-64">
                    <div className="space-y-2">
                        {isCreatingChat && (
                             <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        )}
                        {!isCreatingChat && searchResults.map(user => (
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

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
              <NewMessageDialog onChatSelected={onSelectChat} />
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
