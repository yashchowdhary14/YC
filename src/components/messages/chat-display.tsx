'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Chat, Message } from '@/lib/types';
import { Send, Info, ArrowLeft, Paperclip, X, Image as ImageIcon, Video } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


interface ChatDisplayProps {
  chat: Chat;
  messages: Message[];
  onBack?: () => void;
}

export default function ChatDisplay({ chat, messages: initialMessages, onBack }: ChatDisplayProps) {
  const partner = chat.users[0];
  const currentUserId = 'current-user'; // This would come from auth
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageText, setMessageText] = useState('');
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!messageText.trim() && !mediaPreview) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: chat.id,
      senderId: currentUserId,
      text: messageText,
      timestamp: new Date(),
      isRead: true, // Should be false, but for mock this is fine
      mediaUrl: mediaPreview?.url,
      mediaType: mediaPreview?.type,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setMediaPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview({
          url: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video',
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleMediaSelect = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  }


  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
            <span className="sr-only">Details</span>
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              )}
            >
              {message.senderId !== currentUserId && (
                <Avatar className="h-6 w-6 self-end">
                  <AvatarImage src={partner.avatarUrl} />
                  <AvatarFallback>{partner.username.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 flex flex-col gap-1',
                  message.senderId === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted',
                  message.mediaUrl && 'p-2'
                )}
              >
                {message.mediaUrl && (
                  <div className="relative rounded-lg overflow-hidden aspect-video w-64">
                    {message.mediaType === 'image' ? (
                      <Image src={message.mediaUrl} alt="Sent media" layout="fill" objectFit="cover" />
                    ) : (
                      <video src={message.mediaUrl} controls className="w-full h-full" />
                    )}
                  </div>
                )}
                {message.text && <p className="text-sm">{message.text}</p>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
         {mediaPreview && (
          <div className="relative mb-2 w-40 h-40">
            {mediaPreview.type === 'image' ? (
              <Image src={mediaPreview.url} alt="Media preview" layout="fill" objectFit="cover" className="rounded-md" />
            ) : (
              <video src={mediaPreview.url} controls className="w-full h-full rounded-md" />
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => setMediaPreview(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full">
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach media</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleMediaSelect('image')}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span>Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMediaSelect('video')}>
                  <Video className="mr-2 h-4 w-4" />
                  <span>Video</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Input
            placeholder="Message..."
            className="rounded-full pr-12"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !mediaPreview}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
