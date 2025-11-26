
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import ChatList from '@/components/messages/chat-list';
import ChatDisplay from '@/components/messages/chat-display';
import type { Chat } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useHydratedChats } from '@/hooks/use-hydrated-chats';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();

  const chatsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(
            collection(firestore, 'chats'),
            where('users', 'array-contains', user.uid)
          )
        : null,
    [firestore, user]
  );
  const { data: rawChatsData, isLoading: isLoadingChats } = useCollection(chatsQuery);
  const { chats, isLoading: isHydratingChats } = useHydratedChats(rawChatsData);

  useEffect(() => {
    // This allows linking directly to a chat
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl && chats.length > 0) {
      const chatFromUrl = chats.find(c => c.id === chatIdFromUrl);
      if (chatFromUrl) {
        setSelectedChat(chatFromUrl);
      }
    } else if (!isMobile && chats.length > 0 && !selectedChat) {
      // Default to selecting the first chat on desktop if none is selected
      setSelectedChat(chats[0]);
    }
  }, [chats, searchParams, isMobile, selectedChat]);


  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    if (isMobile) {
        // On mobile, we don't need to change the URL, we just show the view
    } else {
        // On desktop, update URL without full navigation
        router.replace(`/messages?chatId=${chat.id}`, { scroll: false });
    }
  };

  const showChatList = !isMobile || (isMobile && !selectedChat);
  const showChatDisplay = !isMobile || (isMobile && selectedChat);
  const isLoading = isLoadingChats || isHydratingChats;

  if (isMobile) {
    return (
      <SidebarProvider>
        <main className="min-h-svh bg-background">
          <Sidebar>
              <SidebarHeader>
              <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
          </Sidebar>

          <div className={cn('h-svh flex flex-col', showChatList ? 'block' : 'hidden')}>
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
                chatId={selectedChat.id}
                onBack={() => setSelectedChat(null)}
              />
            ) : (
              // This part won't be visible if chat list is shown
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
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
                <ChatDisplay chatId={selectedChat.id}/>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-muted-foreground text-center">
                    <div className="h-24 w-24 rounded-full border-2 border-foreground flex items-center justify-center mb-4">
                        <svg aria-label="Direct" fill="currentColor" height="48" role="img" viewBox="0 0 96 96" width="48"><path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0zm0 88C26.038 88 8 69.962 8 48S26.038 8 48 8s40 17.962 40 40-17.962 40-40 40zm21.362-49.332l-40-12A4.002 4.002 0 0 0 24.1 21.41l14.887 34.738a4 4 0 0 0 7.375.242l6.516-19.548 19.548-6.516a4 4 0 0 0-2.064-7.658z"></path></svg>
                    </div>
                    <h2 className="text-xl font-light">Your Messages</h2>
                    <p className="text-sm">Send private photos and messages to a friend or group.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
