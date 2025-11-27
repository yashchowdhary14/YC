
'use client';


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark, Users2 } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useUser, useFirestore } from '@/firebase';
import { Timestamp, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIntersection } from '@/hooks/use-intersection';
import { PostSkeleton } from './post-skeleton';
import { LazyMedia } from '@/components/ui/lazy-media';


interface PostCardProps {
  post: Post;
  isCard?: boolean;
}

export default function PostCard({ post, isCard = true }: PostCardProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersection(ref, { rootMargin: '300px' }); // Load early

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  // Carousel & Tags State
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
      // Optionally hide tags when sliding
      // setShowTags(false); 
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

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
        await setDoc(savedPostRef, {
          postId: post.id,
          savedAt: serverTimestamp()
        });
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      ref={ref}
      className={isCard ? "mb-4 border-b pb-2 min-h-[500px]" : "min-h-[500px]"}
    >
      {!isIntersecting ? (
        <PostSkeleton />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-2 px-4">
            <div className="flex items-center space-x-3">
              <Link href={`/${post.user.username}`}>
                <Avatar className="w-8 h-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-300">
                  <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
                  <AvatarFallback>{post.user.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="grid gap-0.5 text-sm">
                <Link href={`/${post.user.username}`} className="font-semibold hover:text-primary transition-colors">{post.user.username}</Link>
                {post.location && (
                  <p className="text-xs text-muted-foreground">{post.location}</p>
                )}
                {post.category && (post.type === 'video' || post.type === 'reel') && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit capitalize">
                    {post.category}
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-transparent active:scale-90 transition-transform">
              <MoreHorizontal />
            </Button>
          </div>

          {/* Media */}
          {/* Media */}
          {/* Media */}
          <div className="relative aspect-square bg-muted group">
            {post.mediaUrls && post.mediaUrls.length > 1 ? (
              <Carousel setApi={setApi} className="w-full h-full">
                <CarouselContent>
                  {post.mediaUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square w-full h-full">
                        <LazyMedia
                          src={url}
                          alt={post.accessibility?.alt?.[index] || post.caption || `Slide ${index + 1}`}
                          type={post.type === 'video' ? 'video' : 'photo'}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Carousel Indicators */}
                {post.mediaUrls.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {post.mediaUrls.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide
                          ? 'w-6 bg-primary'
                          : 'w-1.5 bg-white/50 hover:bg-white/75'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </Carousel>
            ) : (
              <LazyMedia
                src={post.mediaUrls ? post.mediaUrls[0] : ''}
                alt={post.accessibility?.alt?.[0] || post.caption || 'Post image'}
                type={post.type === 'video' ? 'video' : 'photo'}
              />
            )}

            {/* Tag Overlay */}
            {post.taggedUsers && post.taggedUsers[currentSlide.toString()] && post.taggedUsers[currentSlide.toString()].length > 0 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-none z-10"
                  onClick={() => setShowTags(!showTags)}
                >
                  <Users2 className="h-4 w-4" />
                </Button>

                {showTags && (
                  <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg max-w-[80%] text-center animate-in fade-in zoom-in duration-200">
                      <p className="text-white font-semibold mb-2 text-sm">In this photo</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {post.taggedUsers[currentSlide.toString()].map(username => (
                          <Link key={username} href={`/${username}`} className="pointer-events-auto">
                            <span className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded-md transition-colors">
                              @{username}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between p-2 px-3">
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" onClick={handleLike} className="hover:scale-110 active:scale-90 transition-transform duration-200">
                <Heart className={cn("transition-colors duration-300", isLiked && "fill-destructive text-destructive")} />
              </Button>
              {!post.disableComments && (
                <Link href={`/p/${post.id}`}>
                  <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-90 transition-transform duration-200">
                    <MessageCircle />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-90 transition-transform duration-200">
                <Send />
              </Button>
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={handleSave} className="hover:scale-110 active:scale-90 transition-transform duration-200">
                <Bookmark className={cn("transition-colors duration-300", isSaved && "fill-foreground")} />
              </Button>
            </div>
          </div>

          {/* Likes and Caption */}
          <div className="px-4 pb-2 text-sm">
            {!post.hideLikes && (
              <p className="font-semibold">{likesCount.toLocaleString()} likes</p>
            )}
            <p className="mt-1">
              <Link href={`/${post.user.username}`} className="font-semibold hover:underline">{post.user.username}</Link>
              <span className="ml-2">{post.caption}</span>
            </p>
            {!post.disableComments && (
              <Link href={`/p/${post.id}`}>
                <p className="text-muted-foreground mt-2 hover:text-foreground transition-colors">View all {post.commentsCount} comments</p>
              </Link>
            )}
            <p className="text-muted-foreground text-xs mt-2 uppercase">
              {formatDistanceToNow(postDate, { addSuffix: true })}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}
