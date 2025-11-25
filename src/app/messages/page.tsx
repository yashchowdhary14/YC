'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import ChatList from '@/components/messages/chat-list';
import ChatDisplay from '@/components/messages/chat-display';
import type { Chat, Message, User } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useHydratedChats } from '@/hooks/use-hydrated-chats';

export default function MessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const isMobile = useIsMobile();

  const chatsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(firestore, 'chats'),
            where('users', 'array-contains', user.uid)
          )
        : null,
    [firestore, user]
  );
  const { data: rawChatsData, isLoading: isLoadingChats } = useCollection(chatsQuery);
  const { chats, isLoading: isHydratingChats } = useHydratedChats(rawChatsData);

  const messagesQuery = useMemoFirebase(
    () =>
      selectedChat
        ? query(
            collection(firestore, 'chats', selectedChat.id, 'messages'),
            orderBy('timestamp', 'asc'),
            limit(50)
          )
        : null,
    [firestore, selectedChat]
  );

  const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const showChatList = !isMobile || (isMobile && !selectedChat);
  const showChatDisplay = !isMobile || (isMobile && selectedChat);
  const isLoading = isLoadingChats || isHydratingChats;

  if (isMobile) {
    return (
      <main className="min-h-svh bg-background">
        <div className={cn('h-svh flex flex-col', showChatList ? 'block' : 'hidden')}>
          {/* The AppHeader now correctly uses the global Sidebar context */}
          <AppHeader />
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} isMobile={isMobile} />
          )}
        </div>
        <div className={cn('h-svh flex flex-col', showChatDisplay ? 'block' : 'hidden')}>
          {selectedChat ? (
            <ChatDisplay
              chat={selectedChat}
              messages={messages || []}
              isLoadingMessages={isLoadingMessages}
              onBack={() => setSelectedChat(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
           <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="grid grid-cols-12 border-t h-[calc(100vh-4rem)]">
            <div className="col-span-4 border-r">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
              )}
            </div>
            <div className="col-span-8">
              {selectedChat ? (
                <ChatDisplay chat={selectedChat} messages={messages || []} isLoadingMessages={isLoadingMessages}/>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>Select a chat to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
