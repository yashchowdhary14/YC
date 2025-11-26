
'use client';

import { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
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
import { useDoc } from '@/firebase/firestore/use-doc';
import type { Chat } from '@/lib/types';


export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  const chatRef = useMemoFirebase(
    () => (firestore && chatId ? doc(firestore, 'chats', chatId as string) : null),
    [firestore, chatId]
  );
  
  const { data: chatData, isLoading } = useDoc<Chat>(chatRef);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Ensure the current user is part of the chat
  if (chatData && user && !chatData.users.includes(user.uid)) {
    // Or redirect to a "not found" or "unauthorized" page
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
