'use client';

import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Crown, Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const initialMessages = [
    { user: 'ChatBot', text: 'Welcome to the stream!', isBot: true },
    { user: 'Alice', text: 'Hey everyone! 👋', color: 'text-purple-400' },
    { user: 'Bob', text: 'What a play!', color: 'text-green-400' },
    { user: 'Charlie', text: 'LMAO 😂', color: 'text-blue-400' },
    { user: 'Diana', text: 'This is my favorite game!', color: 'text-pink-400' },
];

const randomMessages = [
    'Poggers!', 'Nice shot!', 'Let\'s go!', 'Can you play the other map?', 'This is epic!',
    'GG', 'I\'m new here, what\'s happening?', 'Absolutely legendary!', 'Keep up the great work!',
];
const randomUsers = ['Eve', 'Frank', 'Grace', 'Heidi', 'Ivan'];
const userColors = ['text-yellow-400', 'text-orange-400', 'text-cyan-400', 'text-indigo-400', 'text-rose-400'];


export default function LiveChat({ streamer }: { streamer: User }) {
    const { user: currentUser } = useUser();
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
            const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
            const randomColor = userColors[Math.floor(Math.random() * userColors.length)];
            setMessages(prev => [...prev, { user: randomUser, text: randomMsg, color: randomColor }]);
        }, 3000); // New message every 3 seconds

        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        setMessages(prev => [...prev, { user: currentUser.displayName || 'You', text: newMessage, isCurrentUser: true }]);
        setNewMessage('');
    };
    
    return (
        <div className="flex flex-col h-full bg-secondary/50">
            <div className="p-4 text-center border-b">
                <h3 className="font-semibold">Stream Chat</h3>
            </div>
            <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
                <div className="p-4 space-y-4 text-sm">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex gap-2 items-start">
                           {msg.isBot && <Bot className="h-4 w-4 mt-0.5 text-muted-foreground" />}
                           {!msg.isBot && (
                                <span className={cn("font-bold shrink-0", msg.color, msg.isCurrentUser && 'text-primary')}>
                                    {msg.user === streamer.username && <Crown className="inline-block h-4 w-4 mr-1 text-amber-400" />}
                                    {msg.user}:
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
                            />
                             <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                 <Send className="h-4 w-4" />
                             </Button>
                         </div>
                    </form>
                ): (
                    <div className="text-center text-xs text-muted-foreground p-4 bg-background rounded-md">
                        Log in to join the chat!
                    </div>
                )}
            </div>
        </div>
    );
}
