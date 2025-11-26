
'use client';

import { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import ChatDisplay from '@/components/messages/chat-display';
import { Loader2 } from 'lucide-react';
import { dummyChats } from '@/lib/dummy-data';
import type { Chat } from '@/lib/types';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  const chatData: Chat | undefined = useMemo(() => {
    return dummyChats.find(c => c.id === chatId);
  }, [chatId]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Ensure the current user is part of the chat
  if (chatData && user && !chatData.users.includes(user.uid)) {
    router.replace('/messages');
    return (
      <div className="flex h-screen items-center justify-center">
        <p>You are not authorized to view this chat.</p>
      </div>
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
        <main className="h-[calc(100vh-4rem)] bg-background">
           {chatId ? (
                <ChatDisplay chatId={chatId as string} />
           ) : (
                <div className="flex h-full items-center justify-center">
                     <p>Chat not found.</p>
                </div>
           )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
