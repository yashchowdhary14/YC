
'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
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
import { Loader2 } from 'lucide-radix';
import { useDoc } from '@/firebase/firestore/use-doc';
import type { Chat } from '@/lib/types';


export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useUser();
  const firestore = useFirestore();

  const chatRef = useMemoFirebase(
    () => (firestore && chatId ? doc(firestore, 'chats', chatId as string) : null),
    [firestore, chatId]
  );
  
  const { data: chatData, isLoading } = useDoc<Chat>(chatRef);

  // You would typically get the other user's info by fetching their profile
  // based on the ID in chatData.users that isn't the current user's ID.
  // For this example, we'll pass the whole chat object to ChatDisplay
  // and let the hydration hook handle it.
  
  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
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
