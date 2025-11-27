
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import PostCard from '@/components/app/post-card';
import type { Post } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notFound } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import { doc, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getHydratedUser } from '@/lib/dummy-data';

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: any;
  user?: {
    username: string;
    avatarUrl: string;
  }
}

export default function PostPage() {
  const { postId } = useParams();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);


  // Fetch the post
  useEffect(() => {
    if (!firestore || !postId) return;
    const postRef = doc(firestore, 'posts', postId as string);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const hydratedPost = {
            ...data,
            id: docSnap.id,
            user: getHydratedUser(data.uploaderId)
        } as Post;
        setPost(hydratedPost);
      } else {
        setPost(null);
      }
      setIsLoadingPost(false);
    });
    return () => unsubscribe();
  }, [firestore, postId]);
  
  // Fetch comments for the post
  useEffect(() => {
    if (!firestore || !postId) return;
    setIsLoadingComments(true);
    const commentsRef = collection(firestore, 'comments');
    const q = query(
      commentsRef, 
      where('parentId', '==', postId), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          newComments.push({
            ...data,
            id: doc.id,
            user: getHydratedUser(data.userId)
          } as Comment);
      });
      setComments(newComments);
      setIsLoadingComments(false);
    });

    return () => unsubscribe();
  }, [firestore, postId]);


  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || !postId) return;

    setIsSubmitting(true);
    try {
        const commentsRef = collection(firestore, 'comments');
        await addDoc(commentsRef, {
            parentId: postId,
            userId: currentUser.uid,
            text: commentText,
            createdAt: serverTimestamp(),
        });
        setCommentText('');
        toast({ title: 'Comment Posted!' });
    } catch (error) {
        console.error("Error adding comment: ", error);
        toast({ variant: 'destructive', title: "Failed to post comment" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoadingPost) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  if (!post) {
    return notFound();
  }

  return (
      <main className="min-h-screen bg-background pt-14">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center">
          <div className="w-full max-w-md lg:max-w-4xl">
            {/* Mobile View */}
            <div className="lg:hidden">
              <PostCard post={post} />
               {/* Comment Section for Mobile */}
              <div className="mt-4">
                <h2 className="text-sm font-semibold mb-2 px-4">Comments</h2>
                <ScrollArea className="h-64 px-4">
                   {isLoadingComments ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : comments.length > 0 ? (
                       <div className="space-y-4">
                       {comments.map(comment => (
                           <div key={comment.id} className="flex gap-3 items-start text-sm">
                               <Link href={`/${comment.user?.username}`}>
                                   <Avatar className="h-8 w-8">
                                       <AvatarImage src={comment.user?.avatarUrl} />
                                       <AvatarFallback>{comment.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                   </Avatar>
                               </Link>
                               <div>
                                   <p>
                                       <Link href={`/${comment.user?.username}`} className="font-semibold">{comment.user?.username}</Link>
                                       {' '}{comment.text}
                                   </p>
                                   <time className="text-xs text-muted-foreground mt-1">
                                       {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                                   </time>
                               </div>
                           </div>
                       ))}
                       </div>
                   ) : (
                       <div className="text-center py-8 text-muted-foreground">
                           <p>No comments yet.</p>
                           <p className="text-xs">Start the conversation.</p>
                       </div>
                   )}
                </ScrollArea>
                 <div className="p-4 border-t sticky bottom-0 bg-background">
                       <form onSubmit={handleAddComment} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={currentUser?.photoURL || ''} />
                              <AvatarFallback>{currentUser?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <TextareaAutosize
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0 resize-none"
                              disabled={!currentUser || isSubmitting}
                              maxRows={4}
                          />
                          <Button type="submit" variant="ghost" size="sm" disabled={!commentText.trim() || isSubmitting}>
                              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                          </Button>
                      </form>
                  </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <Card className="grid grid-cols-2 overflow-hidden max-h-[calc(100vh-7rem)]">
                 <div className="relative aspect-[4/5] bg-muted">
                  <Image
                    src={post.mediaUrl}
                    alt={post.caption || 'Post image'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                    <div className="border-b p-4">
                        <div className="flex items-center gap-3">
                           <Link href={`/${post.user.username}`}>
                             <Avatar>
                               <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
                               <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
                             </Avatar>
                           </Link>
                           <div className="grid gap-0.5 text-sm flex-1">
                             <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>
                           </div>
                         </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="space-y-4 p-4">
                          {/* Post caption */}
                          <div className="flex gap-3 items-start text-sm">
                              <Link href={`/${post.user.username}`}>
                                  <Avatar className="h-8 w-8">
                                      <AvatarImage src={post.user.avatarUrl} />
                                      <AvatarFallback>{post.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                              </Link>
                              <div>
                                  <p>
                                      <Link href={`/${post.user.username}`} className="font-semibold">{post.user.username}</Link>
                                      {' '}{post.caption}
                                  </p>
                                  <time className="text-xs text-muted-foreground mt-1">
                                      {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : ''}
                                  </time>
                              </div>
                          </div>

                          {/* Divider */}
                          <hr className="border-border" />

                          {/* Comments */}
                          {isLoadingComments ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : comments.length > 0 ? (
                              comments.map(comment => (
                                  <div key={comment.id} className="flex gap-3 items-start text-sm">
                                      <Link href={`/${comment.user?.username}`}>
                                          <Avatar className="h-8 w-8">
                                              <AvatarImage src={comment.user?.avatarUrl} />
                                              <AvatarFallback>{comment.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                          </Avatar>
                                      </Link>
                                      <div>
                                          <p>
                                              <Link href={`/${comment.user?.username}`} className="font-semibold">{comment.user?.username}</Link>
                                              {' '}{comment.text}
                                          </p>
                                          <time className="text-xs text-muted-foreground mt-1">
                                             {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                                          </time>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                  <p>No comments yet.</p>
                                  <p className="text-xs">Start the conversation.</p>
                              </div>
                          )}
                        </div>
                    </ScrollArea>

                    <div className="mt-auto border-t">
                        <div className="p-4">
                            <PostCard post={post} isCard={false} />
                        </div>
                        <div className="p-4 border-t">
                           <form onSubmit={handleAddComment} className="flex items-center gap-2">
                              <TextareaAutosize
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Add a comment..."
                                  className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0 resize-none"
                                  disabled={!currentUser || isSubmitting}
                                  maxRows={4}
                              />
                              <Button type="submit" variant="ghost" size="sm" disabled={!commentText.trim() || isSubmitting}>
                                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                              </Button>
                          </form>
                        </div>
                    </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
  );
}
