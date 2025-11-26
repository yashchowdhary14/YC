
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Chat, Message, User } from '@/lib/types';
import { Send, Info, ArrowLeft, Paperclip, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { collection, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { handleSendMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


interface ChatDisplayProps {
  chatId: string;
  onBack?: () => void;
}

export default function ChatDisplay({ chatId, onBack }: ChatDisplayProps) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [messageText, setMessageText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [partner, setPartner] = useState<User | null>(null);


  const chatDocRef = useMemoFirebase(
    () => (firestore && chatId ? doc(firestore, 'chats', chatId) : null),
    [firestore, chatId]
  );
  const { data: chatData, isLoading: isLoadingChat } = useDoc<Chat>(chatDocRef);
  
  useEffect(() => {
      const fetchPartner = async () => {
          if (chatData?.users && currentUser && firestore) {
              const partnerId = chatData.users.find(id => id !== currentUser.uid);
              if (partnerId) {
                  const userDoc = await getDoc(doc(firestore, 'users', partnerId));
                  if (userDoc.exists()) {
                      const partnerData = userDoc.data();
                      setPartner({
                          id: userDoc.id,
                          username: partnerData.username,
                          fullName: partnerData.fullName,
                          avatarUrl: partnerData.profilePhoto,
                      } as User);
                  }
              }
          }
      }
      fetchPartner();
  }, [chatData, currentUser, firestore]);

  const messagesQuery = useMemoFirebase(
    () =>
      chatId && firestore
        ? query(
            collection(firestore, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc'),
            limit(50)
          )
        : null,
    [firestore, chatId]
  );
  const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);
  
  const onSendMessage = async () => {
    if ((!messageText.trim() && !mediaFile) || !currentUser || !chatId) return;

    setIsSending(true);

    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('senderId', currentUser.uid);
    formData.append('text', messageText);
    if (mediaFile) {
        formData.append('image', mediaFile);
    }
    
    const result = await handleSendMessage(formData);

    if (result.success) {
        setMessageText('');
        setMediaFile(null);
        setMediaPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    } else {
        toast({
            variant: 'destructive',
            title: 'Error sending message',
            description: result.error,
        });
    }

    setIsSending(false);
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

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
  
  const handleMediaSelect = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  }

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  if (isLoadingChat || !partner) {
    return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
            <span className="sr-only">Details</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoadingMessages ? (
             <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
             </div>
        ) : (
            <div className="space-y-4">
            {(messages || []).map((message) => (
                <div
                key={message.id}
                className={cn(
                    'flex items-end gap-2',
                    message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                )}
                >
                {message.senderId !== currentUser?.uid && (
                    <Avatar className="h-6 w-6 self-end">
                    <AvatarImage src={partner.avatarUrl} />
                    <AvatarFallback>{partner.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 flex flex-col gap-1',
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
                    {message.text && <p className="text-sm px-2 py-1">{message.text}</p>}
                </div>
                </div>
            ))}
            </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
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
                <DropdownMenuItem onClick={() => handleMediaSelect('video')} disabled>
                  <Video className="mr-2 h-4 w-4" />
                  <span>Video (soon)</span>
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
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={onSendMessage}
            disabled={isSending || (!messageText.trim() && !mediaFile) || !chatId}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

    