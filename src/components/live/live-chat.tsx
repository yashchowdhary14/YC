
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser } from '@/firebase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Crown, Bot, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { User, LiveBroadcast, LiveChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

// Helper function to generate a random color from a predefined list
const userColors = [
  'text-red-400', 'text-green-400', 'text-blue-400', 
  'text-yellow-400', 'text-purple-400', 'text-pink-400',
  'text-indigo-400', 'text-teal-400'
];
const assignedColors: { [userId: string]: string } = {};
const getUserColor = (userId: string) => {
    if (!assignedColors[userId]) {
        assignedColors[userId] = userColors[Math.floor(Math.random() * userColors.length)];
    }
    return assignedColors[userId];
};


export default function LiveChat({ stream, messages, setMessages }: { stream: LiveBroadcast, messages: LiveChatMessage[], setMessages: React.Dispatch<React.SetStateAction<LiveChatMessage[]>> }) {
  const { user: currentUser } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: LiveChatMessage = useMemo(() => ({
    id: 'bot-welcome',
    userId: 'bot',
    username: 'ChatBot',
    text: `Welcome to ${stream.streamerName}'s stream!`,
    isBot: true,
    timestamp: new Date(),
  }), [stream.streamerName]);

  const displayedMessages = useMemo(() => {
    return [welcomeMessage, ...messages];
  }, [welcomeMessage, messages]);


  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || isSending) return;
    
    setIsSending(true);

    const messageData: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.uid,
      username: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
      text: newMessage,
      timestamp: new Date(),
    };
    
    // Simulate network delay
    await new Promise(res => setTimeout(res, 200));

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setIsSending(false);
  };
    
  return (
    <div className="flex flex-col h-full bg-secondary/50">
      <div className="p-4 text-center border-b">
        <h3 className="font-semibold">Stream Chat</h3>
      </div>
      <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
        <div className="p-4 space-y-4 text-sm">
          {displayedMessages.map((msg) => (
            <div key={msg.id} className="flex gap-2 items-start">
              {msg.isBot && <Bot className="h-4 w-4 mt-0.5 text-muted-foreground" />}
              {!msg.isBot && (
                <span className={cn(
                  "font-bold shrink-0", 
                  getUserColor(msg.userId),
                  msg.userId === currentUser?.uid && 'text-primary'
                )}>
                  {msg.userId === stream.streamerId && <Crown className="inline-block h-4 w-4 mr-1 text-amber-400" />}
                  {msg.username}:
                </span>
              )}
              <span className={cn("break-words", msg.isBot && 'text-muted-foreground italic')}>{msg.text}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        {currentUser ? (
          <form onSubmit={handleSendMessage}>
            <div className="relative">
              <Input 
                placeholder="Send a message..." 
                className="bg-background rounded-lg pr-10"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isSending || !newMessage.trim()}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center text-xs text-muted-foreground p-4 bg-background rounded-md">
            Log in to join the chat!
          </div>
        )}
      </div>
    </div>
  );
}
