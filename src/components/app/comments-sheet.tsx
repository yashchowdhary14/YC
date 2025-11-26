
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Send, Loader2 } from 'lucide-react';
import type { Reel, ReelComment } from '@/lib/types';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

interface CommentItemProps {
  comment: ReelComment;
  onLikeToggle: (commentId: string) => void;
}

function CommentItem({ comment, onLikeToggle }: CommentItemProps) {
    return (
        <div className="flex gap-3 items-start">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.profilePic} />
                <AvatarFallback>{comment.user.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm flex-1">
                <p>
                    <span className="font-semibold">{comment.user}</span>
                    <span className="text-muted-foreground text-xs ml-2">{comment.timeAgo}</span>
                </p>
                <p>{comment.text}</p>
                 <div className="flex items-center gap-2 mt-1">
                    <button className="text-xs text-muted-foreground font-semibold">Reply</button>
                </div>
            </div>
             <div className="flex flex-col items-center">
                <button onClick={() => onLikeToggle(comment.id)}>
                    <Heart className={cn("h-4 w-4 text-muted-foreground", comment.isLiked && "fill-red-500 text-red-500")} />
                </button>
                <span className="text-xs text-muted-foreground">{comment.likes > 0 && comment.likes}</span>
            </div>
        </div>
    )
}

interface CommentsSheetProps {
  reel: Reel | null;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateComment: (reelId: string, updatedComments: ReelComment[]) => void;
  currentUser: { uid: string; displayName: string | null; photoURL: string | null; } | null;
}

export default function CommentsSheet({ reel, onOpenChange, onUpdateComment, currentUser }: CommentsSheetProps) {
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const handleLikeToggle = useCallback((commentId: string) => {
    if (!reel) return;
    const updatedComments = reel.comments.map(c => {
        if (c.id === commentId) {
            return {
                ...c,
                isLiked: !c.isLiked,
                likes: c.isLiked ? c.likes - 1 : c.likes + 1
            };
        }
        return c;
    });
    onUpdateComment(reel.id, updatedComments);
  }, [reel, onUpdateComment]);


  const handleSendComment = async () => {
    if (!commentText.trim() || !reel || isSending || !currentUser) return;
    setIsSending(true);

    const newComment: ReelComment = {
        id: `comment-${Date.now()}`,
        user: currentUser.displayName || 'Anonymous',
        profilePic: currentUser.photoURL || `https://picsum.photos/seed/${currentUser.uid}/100`,
        text: commentText,
        likes: 0,
        timeAgo: '1s',
        isLiked: false
    };

    await new Promise(r => setTimeout(r, 300));
    const updatedComments = [...reel.comments, newComment];
    onUpdateComment(reel.id, updatedComments);

    setCommentText('');
    setIsSending(false);
  };
  
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
      <SheetContent 
        side="bottom" 
        className="h-[60vh] flex flex-col rounded-t-2xl bg-background border-none p-0"
        >
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-8 h-1 bg-zinc-700 rounded-full" />
        </div>
        <SheetHeader className="text-center pb-2 border-b">
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {reel?.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onLikeToggle={handleLikeToggle} />
            ))}
             {reel?.comments.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p className="font-semibold">No comments yet.</p>
                    <p className="text-sm">Start the conversation.</p>
                </div>
             )}
          </div>
        </ScrollArea>
        <SheetFooter className="p-2 border-t bg-background">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser?.photoURL || ''} />
              <AvatarFallback>{currentUser?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
                <TextareaAutosize
                    placeholder={`Add a comment for ${reel?.user.username}...`}
                    className="w-full bg-zinc-900 rounded-2xl py-2 pl-3 pr-10 resize-none text-sm focus:ring-0 focus-visible:ring-offset-0 border-transparent focus:border-transparent"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendComment())}
                    disabled={isSending}
                    maxRows={4}
                    minRows={1}
                />
                <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                    onClick={handleSendComment}
                    disabled={!commentText.trim() || isSending}
                >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
