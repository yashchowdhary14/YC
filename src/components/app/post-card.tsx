import Image from 'next/image';
import { Heart, MessageCircle, Send } from 'lucide-react';
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
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
          <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-semibold">{post.user.username}</span>
          <time
            dateTime={post.createdAt.toISOString()}
            className="text-muted-foreground"
          >
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </time>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[4/5]">
          <Image
            src={post.imageUrl}
            alt={post.imageHint}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            data-ai-hint={post.imageHint}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="flex w-full items-center gap-2">
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
          <span className="font-semibold">{post.user.username}</span>{' '}
          {post.caption}
        </p>
        <div className="text-sm text-muted-foreground">
          View all {post.commentsCount.toLocaleString()} comments
        </div>
      </CardFooter>
    </Card>
  );
}
