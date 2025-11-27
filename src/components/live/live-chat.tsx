
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useUser } from '@/firebase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Crown, Bot, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { LiveBroadcast, LiveChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LiveChatProps {
  stream: LiveBroadcast;
  messages: LiveChatMessage[];
  setMessages: (messages: LiveChatMessage[]) => void;
  variant?: 'default' | 'overlay';
}

export default function LiveChat({ stream, messages, setMessages, variant = 'default' }: LiveChatProps) {
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
      setTimeout(() => {
        if (scrollViewportRef.current) {
          scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
      }, 100);
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

    // Simulate network delay and update local state
    await new Promise(r => setTimeout(r, 200));

    setMessages([...messages, messageData]);
    setNewMessage('');
    setIsSending(false);
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      variant === 'default' ? "bg-secondary/50" : "bg-black/40 backdrop-blur-sm text-white rounded-lg overflow-hidden border border-white/10"
    )}>
      <div className={cn("p-4 text-center border-b", variant === 'overlay' && "border-white/10 bg-black/20")}>
        <h3 className="font-semibold">Stream Chat</h3>
      </div>
      <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
        <div className="p-4 space-y-4 text-sm">
          {displayedMessages.map((msg) => (
            <div key={msg.id} className="flex gap-2 items-start">
              {msg.isBot && <Bot className={cn("h-4 w-4 mt-0.5", variant === 'overlay' ? "text-white/70" : "text-muted-foreground")} />}
              {!msg.isBot && (
                <span className={cn(
                  "font-bold shrink-0",
                  msg.userId === stream.streamerId && (variant === 'overlay' ? 'text-amber-400' : 'text-foreground'),
                  msg.userId === currentUser?.uid && 'text-primary',
                  (msg.userId !== stream.streamerId && msg.userId !== currentUser?.uid) && (variant === 'overlay' ? 'text-white/70' : 'text-muted-foreground')
                )}>
                  {msg.userId === stream.streamerId && <Crown className="inline-block h-4 w-4 mr-1 text-amber-400" />}
                  {msg.username}:
                </span>
              )}
              <span className={cn("break-words", msg.isBot && (variant === 'overlay' ? 'text-white/70 italic' : 'text-muted-foreground italic'))}>{msg.text}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      {variant === 'default' && <Separator />}
      <div className={cn("p-4", variant === 'overlay' && "bg-black/20")}>
        {currentUser ? (
          <form onSubmit={handleSendMessage}>
            <div className="relative">
              <Input
                placeholder="Send a message..."
                className={cn(
                  "pr-10",
                  variant === 'default' ? "bg-background rounded-lg" : "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                )}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <Button type="submit" variant="ghost" size="icon" className={cn("absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8", variant === 'overlay' && "text-white hover:bg-white/10 hover:text-white")} disabled={isSending || !newMessage.trim()}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        ) : (
          <div className={cn("text-center text-xs p-4 rounded-md", variant === 'default' ? "text-muted-foreground bg-background" : "text-white/70 bg-white/10")}>
            Log in to join the chat!
          </div>
        )}
      </div>
    </div>
  );
}
