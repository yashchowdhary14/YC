
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Chat, Message, User } from '@/lib/types';
import { Send, Info, ArrowLeft, Paperclip, X, Loader2, Play, Smile, Mic } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { getChat, addMessageToChat, dummyUsers } from '@/lib/dummy-data';
import { Textarea } from '@/components/ui/textarea';

interface ChatDisplayProps {
  chatId: string;
  onBack?: () => void;
}

export default function ChatDisplay({ chatId, onBack }: ChatDisplayProps) {
  const { user: currentUser } = useUser();
  const { toast } = useToast();

  const [messageText, setMessageText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Use a state to force re-render when dummy data changes
  const [_, setForceUpdate] = useState(0);

  const chatData = useMemo(() => getChat(chatId), [chatId, _]);

  const messages = chatData?.messages || [];

  const partner = useMemo(() => {
    if (!chatData || !currentUser) return null;
    const partnerId = chatData.users.find(id => id !== currentUser.uid);
    if (!partnerId) return null;
    const partnerData = dummyUsers.find(u => u.id === partnerId);
    if (!partnerData) return null;
    return {
      ...partnerData,
      avatarUrl: `https://picsum.photos/seed/${partnerData.id}/100/100`,
    } as User;
  }, [chatData, currentUser]);

  const onSendMessage = async () => {
    if ((!messageText.trim() && !mediaFile) || !currentUser || !chatId) return;

    setIsSending(true);
    await new Promise(r => setTimeout(r, 300)); // Simulate network latency

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: currentUser.uid,
      text: messageText,
      timestamp: new Date(),
      isRead: false,
      mediaUrl: mediaPreview || undefined,
    };

    const success = addMessageToChat(chatId, newMessage);
    if (success) {
      setForceUpdate(val => val + 1); // Trigger re-render
    }


    setMessageText('');
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsSending(false);
  };

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, mediaPreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select an image smaller than 4MB.',
        });
        return;
      }
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  if (!chatData || !partner) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Chat not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 p-4 border-b">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar>
          <AvatarImage src={partner.avatarUrl} alt={partner.username} />
          <AvatarFallback>{partner.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{partner.fullName}</p>
          <p className="text-sm text-muted-foreground">@{partner.username}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
          <span className="sr-only">Details</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2 group relative',
                message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
              )}
            >
              {message.senderId !== currentUser?.uid && (
                <Avatar className="h-6 w-6 self-end">
                  <AvatarImage src={partner.avatarUrl} />
                  <AvatarFallback>{partner.username.charAt(0)}</AvatarFallback>
                </Avatar>
              )}

              {/* Message Bubble */}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 flex flex-col gap-1 relative',
                  message.senderId === currentUser?.uid
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted',
                  message.mediaUrl && 'p-1'
                )}
              >
                {message.mediaUrl && (
                  <div className="relative rounded-lg overflow-hidden aspect-square w-64">
                    <Image src={message.mediaUrl} alt="Sent media" fill className="object-cover" />
                  </div>
                )}

                {/* Voice Message Mock */}
                {message.text === '🎤 Voice Message' && (
                  <div className="flex items-center gap-3 px-2 py-1 min-w-[150px]">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-background/20 hover:bg-background/30">
                      <Play className="h-4 w-4 fill-current" />
                    </Button>
                    <div className="h-1 flex-1 bg-background/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-current rounded-full" />
                    </div>
                    <span className="text-xs font-mono">0:12</span>
                  </div>
                )}

                {message.text && message.text !== '🎤 Voice Message' && <p className="text-sm px-2 py-1 break-words">{message.text}</p>}

                <time className={cn("text-[10px] opacity-70 px-2", message.senderId === currentUser?.uid ? "text-right" : "text-left")}>
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </time>

                {/* Reactions Display (Mock) */}
                {Math.random() > 0.8 && (
                  <div className="absolute -bottom-2 right-0 bg-background border rounded-full px-1.5 py-0.5 text-xs shadow-sm flex items-center gap-0.5">
                    <span>❤️</span>
                    <span className="text-[10px] text-muted-foreground">1</span>
                  </div>
                )}
              </div>

              {/* Reaction Action (Hover) */}
              <div className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 flex gap-1",
                message.senderId === currentUser?.uid ? "-left-12" : "-right-12"
              )}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background border shadow-sm hover:bg-accent">
                  <Smile className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        {mediaPreview && (
          <div className="relative mb-2 w-24 h-24">
            <Image src={mediaPreview} alt="Media preview" fill className="object-cover rounded-md" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={clearMedia}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            // Mock sending a voice message
            setMessageText('🎤 Voice Message');
            setTimeout(() => onSendMessage(), 100);
          }}>
            <Mic className="h-5 w-5" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Textarea
            autosize
            placeholder="Message..."
            className="rounded-full pr-12"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            disabled={isSending}
            minRows={1}
            maxRows={5}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={onSendMessage}
            disabled={isSending || (!messageText.trim() && !mediaFile)}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
