'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
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

interface PostCardProps {
  post: Post;
  isCard?: boolean;
}

export default function PostCard({ post, isCard = true }: PostCardProps) {
  const Wrapper = isCard ? Card : 'div';
  
  return (
    <Wrapper className="max-w-xl mx-auto w-full">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/${post.user.username}`}>
          <Avatar>
            <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
            <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="grid gap-0.5 text-sm flex-1">
          <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>
          <time
            dateTime={post.createdAt.toISOString()}
            className="text-muted-foreground"
          >
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </time>
        </div>
         <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      { isCard && (
          <CardContent className="p-0">
            <Link href={`/p/${post.id}`}>
              <div className="relative aspect-square">
                <Image
                  src={post.imageUrl}
                  alt={post.imageHint}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  data-ai-hint={post.imageHint}
                />
              </div>
            </Link>
          </CardContent>
      )}
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="flex w-full items-center gap-1">
          <Button variant="ghost" size="icon">
            <Heart className="h-6 w-6" />
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Comment</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-6 w-6" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
        <div className="text-sm font-semibold">
          {post.likes.toLocaleString()} likes
        </div>
        <p className="text-sm">
          <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>{' '}
          {post.caption}
        </p>
        <Link href={`/p/${post.id}#comments`}>
          <div className="text-sm text-muted-foreground">
            View all {post.commentsCount.toLocaleString()} comments
          </div>
        </Link>
      </CardFooter>
    </Wrapper>
  );
}
