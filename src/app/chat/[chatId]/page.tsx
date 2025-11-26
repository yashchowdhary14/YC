
'use client';

import { useMemo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ChatDisplay from '@/components/messages/chat-display';
import { Loader2 } from 'lucide-react';
import { getChat } from '@/lib/dummy-data';
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

  // We use a state to force re-renders if dummy data changes.
  const [_, setForceRender] = useState(0);

  const chatData: Chat | undefined = useMemo(() => {
    return getChat(chatId);
  }, [chatId, _]);
  
  useEffect(() => {
    if (chatData && user && !chatData.users.includes(user.uid)) {
      router.replace('/messages');
    }
  }, [chatData, user, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Ensure the current user is part of the chat, redirect if not
  if (chatData && user && !chatData.users.includes(user.uid)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>You are not authorized to view this chat. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background pt-14">
       {chatId ? (
            <ChatDisplay chatId={chatId as string} />
       ) : (
            <div className="flex h-full items-center justify-center">
                 <p>Chat not found.</p>
            </div>
       )}
    </div>
  );
}
