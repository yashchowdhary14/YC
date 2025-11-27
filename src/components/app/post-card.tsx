
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useUser, useFirestore } from '@/firebase';
import { Timestamp, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';


interface PostCardProps {
    post: Post;
    isCard?: boolean;
}

export default function PostCard({ post, isCard = true }: PostCardProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  useEffect(() => {
    if (user && post.likes) {
      // The `likes` field on the post is just a number count.
      // A real implementation might have a subcollection or an array of UIDs.
      // For this step, we'll simulate the check.
      // This part of the code won't work until we have a proper `likes` array.
    }
  }, [user, post.likes]);

  const handleLike = async () => {
    if (!user || !firestore) return;
    
    const postRef = doc(firestore, 'posts', post.id);
    const newLikedState = !isLiked;
    
    // Optimistic update
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
        await updateDoc(postRef, {
            likes: newLikedState ? arrayUnion(user.uid) : arrayRemove(user.uid)
        });
    } catch (e) {
        // Revert optimistic update on error
        setIsLiked(!newLikedState);
        setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
        toast({ variant: 'destructive', title: 'Failed to update like.' });
    }
  }

  const handleSave = async () => {
      if (!user || !firestore) return;
      
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      
      const savedPostRef = doc(firestore, `users/${user.uid}/savedPosts`, post.id);

      try {
          if (newSavedState) {
              await writeBatch(firestore).set(savedPostRef, {
                  postId: post.id,
                  savedAt: serverTimestamp()
              }).commit();
              toast({ title: "Post Saved!" });
          } else {
              await deleteDoc(savedPostRef);
              toast({ title: "Post Unsaved" });
          }
      } catch (e) {
          setIsSaved(!newSavedState);
          toast({ variant: 'destructive', title: 'Failed to save post.' });
      }
  }


  if (!post || !post.user) {
    return null; // Or a skeleton
  }

  // Handle both Date and Firestore Timestamp objects
  const postDate = post.createdAt instanceof Timestamp 
    ? post.createdAt.toDate() 
    : new Date(post.createdAt);

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
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart className={cn(isLiked && "fill-destructive text-destructive")} />
          </Button>
          <Link href={`/p/${post.id}`}><Button variant="ghost" size="icon"><MessageCircle /></Button></Link>
          <Button variant="ghost" size="icon"><Send /></Button>
        </div>
        <div>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Bookmark className={cn(isSaved && "fill-foreground")} />
            </Button>
        </div>
      </div>

      {/* Likes and Caption */}
      <div className="px-4 pb-2 text-sm">
        <p className="font-semibold">{likesCount.toLocaleString()} likes</p>
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
