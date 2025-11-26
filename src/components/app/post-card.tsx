
'use client';

import { useOptimistic, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark, CheckCircle } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
  isCard?: boolean;
}

export default function PostCard({ post, isCard = true }: PostCardProps) {
  const Wrapper = isCard ? Card : 'div';
  const { user } = useUser();
  const { toast } = useToast();

  const [optimisticPost, toggleOptimisticLike] = useOptimistic(
    post,
    (state, newLikes: number) => {
      return { ...state, likes: newLikes, isLiked: !state.isLiked };
    }
  );

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to like a post.',
      });
      return;
    }
    const newLikesCount = isLiked ? optimisticPost.likes - 1 : optimisticPost.likes + 1;
    setIsLiked(!isLiked);
    toggleOptimisticLike(newLikesCount);
  };
  
  const handleBookmark = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to save a post.',
      });
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Wrapper className="max-w-xl mx-auto w-full border-0 md:border-b">
      <CardHeader className="flex flex-row items-center gap-3 p-2 md:p-4">
        <Link href={`/${post.user.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
            <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="grid gap-0.5 text-sm flex-1">
          <div className="flex items-center gap-1">
            <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>
            {post.user.verified && <CheckCircle className="h-4 w-4 text-blue-500 fill-current" />}
            <span className="text-muted-foreground font-normal ml-2 text-xs">· {formatDistanceToNow(new Date(post.createdAt), { addSuffix: false })}</span>
          </div>
          <span className="text-xs text-muted-foreground">Suggested for you</span>
        </div>
        <Button variant="link" size="sm" className="text-primary font-semibold text-sm p-0 h-auto hidden md:block">Follow</Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      {isCard && (
        <CardContent className="p-0">
          <Link href={`/p/${post.id}`}>
            <div className="relative aspect-square">
              <Image
                src={post.mediaUrl}
                alt={post.caption || 'post image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
          </Link>
        </CardContent>
      )}
      <CardFooter className="flex flex-col items-start gap-2 p-2 md:p-4">
        <div className="flex w-full items-center">
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart className={cn("h-6 w-6", isLiked && "fill-red-500 text-red-500")} />
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/p/${post.id}`}>
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Comment</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-6 w-6" />
            <span className="sr-only">Share</span>
          </Button>
           <Button variant="ghost" size="icon" className="ml-auto" onClick={handleBookmark}>
            <Bookmark className={cn("h-6 w-6", isBookmarked && "fill-foreground text-foreground")} />
            <span className="sr-only">Save</span>
          </Button>
        </div>
        <div className="text-sm font-semibold px-2">
          {optimisticPost.likes.toLocaleString()} likes
        </div>
        <p className="text-sm px-2">
          <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>{' '}
          {post.caption}
        </p>
        {post.commentsCount > 0 && (
          <Link href={`/p/${post.id}`}>
            <div className="text-sm text-muted-foreground px-2">
              View all {post.commentsCount.toLocaleString()} comments
            </div>
          </Link>
        )}
      </CardFooter>
    </Wrapper>
  );
}
