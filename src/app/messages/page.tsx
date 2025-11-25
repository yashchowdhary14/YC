'use client';

import { useState } from 'react';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import ChatList from '@/components/messages/chat-list';
import ChatDisplay from '@/components/messages/chat-display';
import type { Chat, Message } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data based on the types
const mockChats: Chat[] = [
  {
    id: 'chat-1',
    users: [
      {
        id: 'user-2',
        username: 'tech_explorer',
        avatarUrl: 'https://picsum.photos/seed/user2/100/100',
        fullName: 'Alex Doe',
      },
    ],
    lastMessage: {
      id: 'msg-1-3',
      text: 'Sounds great, see you then!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
  },
  {
    id: 'chat-2',
    users: [
      {
        id: 'user-3',
        username: 'art_creator',
        avatarUrl: 'https://picsum.photos/seed/user3/100/100',
        fullName: 'Bella Smith',
      },
    ],
    lastMessage: {
      id: 'msg-2-2',
      text: 'Just sent over the new designs.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
  },
  {
    id: 'chat-3',
    users: [
      {
        id: 'user-4',
        username: 'foodie_fanatic',
        avatarUrl: 'https://picsum.photos/seed/user4/100/100',
        fullName: 'Charlie Green',
      },
    ],
    lastMessage: {
      id: 'msg-3-1',
      text: "Let's try that new restaurant tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
  },
  {
    id: 'chat-4',
    users: [
      {
        id: 'user-5',
        username: 'developer_dan',
        avatarUrl: 'https://picsum.photos/seed/user5/100/100',
        fullName: 'Dan Coder',
      },
    ],
    lastMessage: {
      id: 'msg-4-1',
      text: 'Check out this cool video!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      isRead: false,
      mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      mediaType: 'video',
    },
  },
];

const mockMessages: { [key: string]: Message[] } = {
  'chat-1': [
    {
      id: 'msg-1-1',
      chatId: 'chat-1',
      senderId: 'user-2',
      text: 'Hey! Are we still on for the project meeting tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: true,
    },
    {
      id: 'msg-1-2',
      chatId: 'chat-1',
      senderId: 'current-user', // Assuming current user
      text: 'Yep, absolutely. I have the presentation ready.',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isRead: true,
    },
    {
      id: 'msg-1-3',
      chatId: 'chat-1',
      senderId: 'user-2',
      text: 'Sounds great, see you then!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
     {
      id: 'msg-1-4',
      chatId: 'chat-1',
      senderId: 'user-2',
      text: 'And here is that image you asked for.',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      isRead: false,
      mediaUrl: 'https://picsum.photos/seed/image1/400/300',
      mediaType: 'image'
    },
  ],
  'chat-2': [
    {
      id: 'msg-2-1',
      chatId: 'chat-2',
      senderId: 'current-user',
      text: 'Hey Bella, any update on the logo designs?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: true,
    },
    {
      id: 'msg-2-2',
      chatId: 'chat-2',
      senderId: 'user-3',
      text: 'Just sent over the new designs.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
  ],
  'chat-3': [
     {
      id: 'msg-3-1',
      chatId: 'chat-3',
      senderId: 'user-4',
      text: "Let's try that new restaurant tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
  ],
  'chat-4': [
    {
      id: 'msg-4-1',
      chatId: 'chat-4',
      senderId: 'user-5',
      text: 'Check out this cool video!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      isRead: false,
      mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      mediaType: 'video',
    },
  ]
};

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const isMobile = useIsMobile();
  
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  }

  const messages = selectedChat ? mockMessages[selectedChat.id] : [];

  const showChatList = !isMobile || (isMobile && !selectedChat);
  const showChatDisplay = !isMobile || (isMobile && selectedChat);

  if (isMobile) {
    return (
      <SidebarProvider>
        <main className="min-h-svh bg-background">
          <div className={cn('h-svh flex flex-col', showChatList ? 'block' : 'hidden')}>
              <div className="p-4 border-b flex items-center gap-4">
                  <Sidebar anInset>
                    <AppHeader/>
                  </Sidebar>
                  <h1 className="text-xl font-semibold">Messages</h1>
              </div>
              <ChatList chats={mockChats} selectedChat={selectedChat} onSelectChat={handleSelectChat} isMobile={isMobile} />
          </div>
           <div className={cn('h-svh flex flex-col', showChatDisplay ? 'block' : 'hidden')}>
            {selectedChat ? (
               <ChatDisplay 
                chat={selectedChat} 
                messages={messages} 
                onBack={() => setSelectedChat(null)}
              />
            ) : (
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
          <div className="flex items-center gap-2 p-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">YC</h1>
          </div>
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
                <ChatList chats={mockChats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
            </div>
            <div className="col-span-8">
                {selectedChat ? (
                    <ChatDisplay chat={selectedChat} messages={messages} />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
