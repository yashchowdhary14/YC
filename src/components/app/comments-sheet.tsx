
'use client';

import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import type { Reel, ReelComment, User as UserType } from '@/lib/types';

interface CommentsSheetProps {
  reel: Reel | null;
  onOpenChange: (isOpen: boolean) => void;
  onAddComment: (reelId: string, commentText: string) => void;
  currentUser: { displayName: string | null, photoURL: string | null } | null;
}

export default function CommentsSheet({ reel, onOpenChange, onAddComment, currentUser }: CommentsSheetProps) {
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendComment = async () => {
    if (!commentText.trim() || !reel || isSending) return;
    setIsSending(true);
    await new Promise(r => setTimeout(r, 300)); // Simulate API call
    onAddComment(reel.id, commentText);
    setCommentText('');
    setIsSending(false);
  };
  
  // Scroll to bottom when new comments are added or sheet opens
  useEffect(() => {
    if (reel && scrollAreaRef.current) {
      setTimeout(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [reel?.comments.length, reel]);

  return (
    <Sheet open={!!reel} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-lg">
        <SheetHeader className="text-center py-4 border-b">
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {reel?.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 items-start">
                <Avatar className="h-8 w-8">
                  {/* Using a generic avatar for comments for simplicity */}
                  <AvatarImage src={`https://picsum.photos/seed/${comment.user}/100`} />
                  <AvatarFallback>{comment.user.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">{comment.user}</span>
                    {' '}{comment.text}
                  </p>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>
              </div>
            ))}
             {reel?.comments.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p className="font-semibold">No comments yet.</p>
                    <p className="text-sm">Start the conversation.</p>
                </div>
             )}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t bg-background">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser?.photoURL || ''} />
              <AvatarFallback>{currentUser?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              placeholder={`Comment as ${currentUser?.displayName || 'user'}...`}
              className="flex-1 rounded-full"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              disabled={isSending}
            />
            <Button
              size="icon"
              className="rounded-full"
              onClick={handleSendComment}
              disabled={!commentText.trim() || isSending}
            >
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
