
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/firebase';

interface PostCardProps {
    post: Post;
    isCard?: boolean;
}

export default function PostCard({ post, isCard = true }: PostCardProps) {
  const { user, isUserLoading } = useUser();
  
  if (!post || !post.user) {
    return null; // Or a skeleton
  }

  const postDate = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);

  return (
    <div className={isCard ? "mb-4 border-b pb-2" : ""}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 px-4">
        <div className="flex items-center space-x-3">
          <Link href={`/${post.user.username}`}>
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
              <AvatarFallback>{post.user.username?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="grid gap-0.5 text-sm">
            <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>
            {post.location && <span className="text-xs">{post.location}</span>}
          </div>
        </div>
        <Button variant="ghost" size="icon">
            <MoreHorizontal />
        </Button>
      </div>
      
      {/* Media */}
      <div className="relative aspect-square bg-muted">
        {post.type === 'photo' ? (
            <Image src={post.mediaUrl} alt={post.caption || 'Post image'} fill className="object-cover" />
        ) : (
            <video src={post.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between p-2 px-3">
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon"><Heart /></Button>
          <Link href={`/p/${post.id}`}><Button variant="ghost" size="icon"><MessageCircle /></Button></Link>
          <Button variant="ghost" size="icon"><Send /></Button>
        </div>
        <div>
            <Button variant="ghost" size="icon"><Bookmark /></Button>
        </div>
      </div>

      {/* Likes and Caption */}
      <div className="px-4 pb-2 text-sm">
        <p className="font-semibold">{post.likes.toLocaleString()} likes</p>
        <p className="mt-1">
          <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>
          <span className="ml-2">{post.caption}</span>
        </p>
        <Link href={`/p/${post.id}`}>
            <p className="text-muted-foreground mt-2">View all {post.commentsCount} comments</p>
        </Link>
        <p className="text-muted-foreground text-xs mt-2 uppercase">
            {formatDistanceToNow(postDate, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
