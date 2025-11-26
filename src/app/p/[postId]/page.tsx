
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import PostCard from '@/components/app/post-card';
import type { Post } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dummyPosts, dummyUsers } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
  user?: {
    username: string;
    avatarUrl: string;
  }
}

export default function PostPage() {
  const { postId } = useParams();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hydratedComments, setHydratedComments] = useState<Comment[]>([]);

  const post = useMemo((): Post | null => {
    return dummyPosts.find(p => p.id === postId) || null;
  }, [postId]);

  // Simulate comment fetching and hydration
  useEffect(() => {
    // In a real app, this would be a fetch. Here we just generate some dummy comments.
    const comments: Comment[] = Array.from({ length: 3 }).map((_, i) => {
      const user = dummyUsers[i % dummyUsers.length];
      return {
        id: `comment-${i}`,
        userId: user.id,
        text: `This is a great comment, thanks for sharing! #${i + 1}`,
        createdAt: new Date(Date.now() - (i + 1) * 60000 * 5),
        user: {
          username: user.username,
          avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`,
        },
      };
    });
    setHydratedComments(comments);
  }, [postId]);


  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || !postId) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment: Comment = {
      id: `new-comment-${Date.now()}`,
      userId: currentUser.uid,
      text: commentText,
      createdAt: new Date(),
      user: {
        username: currentUser.email?.split('@')[0] || 'User',
        avatarUrl: currentUser.photoURL || `https://picsum.photos/seed/${currentUser.uid}/100/100`,
      }
    };
    setHydratedComments(prev => [...prev, newComment]);
    setCommentText('');

    toast({ title: 'Comment Posted!' });
    setIsSubmitting(false);
  };

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
                   {hydratedComments.length > 0 ? (
                       <div className="space-y-4">
                       {hydratedComments.map(comment => (
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
                                       {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
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
                                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                  </time>
                              </div>
                          </div>

                          {/* Divider */}
                          <hr className="border-border" />

                          {/* Comments */}
                          {hydratedComments.length > 0 ? (
                              hydratedComments.map(comment => (
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
                                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
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
