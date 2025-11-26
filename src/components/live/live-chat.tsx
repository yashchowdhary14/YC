'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Crown, Bot, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { User, Stream } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LiveChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: any; // Can be Date or FieldValue
  color?: string;
  isBot?: boolean;
}

export default function LiveChat({ stream }: { stream: Stream }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !stream) return null;
    return query(
      collection(firestore, 'streams', stream.id, 'live-chat-messages'),
      orderBy('timestamp', 'asc')
    );
  }, [firestore, stream]);

  const { data: messages, isLoading } = useCollection<LiveChatMessage>(messagesQuery);
  
  const welcomeMessage: LiveChatMessage = useMemo(() => ({
    id: 'bot-welcome',
    userId: 'bot',
    username: 'ChatBot',
    text: `Welcome to ${stream.user.username}'s stream!`,
    isBot: true,
    timestamp: new Date(),
  }), [stream.user.username]);

  const displayedMessages = useMemo(() => {
    return [welcomeMessage, ...(messages || [])];
  }, [welcomeMessage, messages]);


  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !firestore || !stream || isSending) return;
    
    setIsSending(true);

    const messageData = {
      userId: currentUser.uid,
      username: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
      text: newMessage,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(firestore, 'streams', stream.id, 'live-chat-messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };
    
  return (
    <div className="flex flex-col h-full bg-secondary/50">
      <div className="p-4 text-center border-b">
        <h3 className="font-semibold">Stream Chat</h3>
      </div>
      <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
        <div className="p-4 space-y-4 text-sm">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {!isLoading && displayedMessages.map((msg) => (
            <div key={msg.id} className="flex gap-2 items-start">
              {msg.isBot && <Bot className="h-4 w-4 mt-0.5 text-muted-foreground" />}
              {!msg.isBot && (
                <span className={cn(
                  "font-bold shrink-0", 
                  msg.color, 
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
                disabled={isSending || isLoading}
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
