
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/firebase';
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
import type { Chat, User as UserType } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { dummyChats, dummyUsers } from '@/lib/dummy-data';

export default function MessagesPage() {
  const { user } = useUser();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();

  const chats: Chat[] = useMemo(() => {
    if (!user) return [];
    return dummyChats
      .filter(chat => chat.users.includes(user.uid))
      .map(chat => {
        const userDetails = chat.users.map(userId => {
          const u = dummyUsers.find(du => du.id === userId)!;
          return {
            ...u,
            avatarUrl: `https://picsum.photos/seed/${u.id}/100/100`,
          };
        });
        return { ...chat, userDetails };
      });
  }, [user]);

  const selectedChat = useMemo(() => {
    return chats.find(c => c.id === selectedChatId) || null;
  }, [selectedChatId, chats]);
  
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl) {
      setSelectedChatId(chatIdFromUrl);
    } else if (!isMobile && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [searchParams, isMobile, chats, selectedChatId]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChatId(chat.id);
    if (!isMobile) {
      router.replace(`/messages?chatId=${chat.id}`, { scroll: false });
    }
  };

  const showChatList = !isMobile || (isMobile && !selectedChat);
  const showChatDisplay = !isMobile || (isMobile && selectedChat);

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
            <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} isMobile={isMobile} />
          </div>
          
          <div className={cn('h-svh flex flex-col', showChatDisplay ? 'block' : 'hidden')}>
            {selectedChat ? (
              <ChatDisplay
                chatId={selectedChat.id}
                onBack={() => setSelectedChatId(null)}
              />
            ) : null}
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
              <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
            </div>
            <div className="col-span-8">
              {selectedChat ? (
                <ChatDisplay chatId={selectedChat.id} />
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
