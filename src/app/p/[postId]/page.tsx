'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useFirestore, useDoc, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { Loader2, Send } from 'lucide-react';
import PostCard from '@/components/app/post-card';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addComment } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: { toDate: () => Date };
  user?: {
    username: string;
    avatarUrl: string;
  }
}

export default function PostPage() {
  const { postId } = useParams();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postRef = useMemoFirebase(
    () => (firestore && postId ? doc(firestore, 'posts', postId as string) : null),
    [firestore, postId]
  );
  
  const { data: postData, isLoading, error } = useDoc(postRef);

  const post: Post | null = postData ? {
    id: postData.id,
    user: {
      id: postData.userId,
      username: 'loading...',
      fullName: 'loading...',
      avatarUrl: `https://picsum.photos/seed/${postData.userId}/100/100`,
    },
    imageUrl: postData.imageUrl,
    imageHint: postData.imageHint || '',
    caption: postData.caption,
    createdAt: postData.createdAt?.toDate ? postData.createdAt.toDate() : new Date(),
    likes: postData.likes || [],
    commentsCount: postData.commentsCount || 0,
  } : null;
  
   const userRef = useMemoFirebase(
    () => (firestore && post?.user.id ? doc(firestore, 'users', post.user.id) : null),
    [firestore, post]
  );
  const { data: userData } = useDoc(userRef);

  if (post && userData) {
      post.user.username = userData.username || 'unknown';
      post.user.fullName = userData.fullName || 'Unknown User';
      post.user.avatarUrl = userData.profilePhoto || `https://picsum.photos/seed/${post.user.id}/100/100`;
  }
  
  // Fetch Comments
  const commentsQuery = useMemoFirebase(
    () => firestore && postId ? query(collection(firestore, 'comments'), where('parentId', '==', postId as string), orderBy('createdAt', 'asc')) : null,
    [firestore, postId]
  );
  const { data: commentsData, isLoading: isLoadingComments } = useCollection<Omit<Comment, 'user'>>(commentsQuery);
  const [hydratedComments, setHydratedComments] = useState<Comment[]>([]);

  // Hydrate comments with user data
  useEffect(() => {
    if (!commentsData || !firestore) return;

    const hydrate = async () => {
      const userCache = new Map<string, any>();
      const promises = commentsData.map(async (comment) => {
        let user;
        if (userCache.has(comment.userId)) {
          user = userCache.get(comment.userId);
        } else {
          const userDoc = await getDoc(doc(firestore, 'users', comment.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            user = {
              username: userData.username,
              avatarUrl: userData.profilePhoto || `https://picsum.photos/seed/${comment.userId}/100/100`,
            };
            userCache.set(comment.userId, user);
          }
        }
        return { ...comment, user };
      });
      const resolvedComments = await Promise.all(promises);
      setHydratedComments(resolvedComments as Comment[]);
    }
    hydrate();
  }, [commentsData, firestore]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || !postId) return;

    setIsSubmitting(true);
    const result = await addComment(postId as string, currentUser.uid, commentText);

    if (result.success) {
      setCommentText('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to comment',
        description: result.error,
      });
    }
    setIsSubmitting(false);
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">YC</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="w-full max-w-md lg:max-w-4xl">
              {isLoading && (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {error && (
                <Card className="p-8 text-center">
                  <h2 className="text-xl font-semibold text-destructive">Error</h2>
                  <p className="text-muted-foreground mt-2">Could not load the post. It may have been removed or the link is incorrect.</p>
                </Card>
              )}
              {!isLoading && !error && post && (
                 <div className="lg:hidden">
                    <PostCard post={post} />
                </div>
              )}
               {!isLoading && !error && post && (
                <div className="hidden lg:block">
                  <Card className="grid grid-cols-2 overflow-hidden max-h-[80vh]">
                     <div className="relative aspect-[4/5] bg-muted">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageHint || 'Post image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                        <PostCard post={post} isCard={false} />
                        <ScrollArea className="flex-1 px-4 py-2 border-t">
                            {isLoadingComments ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : hydratedComments.length > 0 ? (
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
                                                {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
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
                        <div className="p-4 border-t">
                             <form onSubmit={handleAddComment} className="flex items-center gap-2">
                                <Input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0"
                                    disabled={!currentUser || isSubmitting}
                                />
                                <Button type="submit" variant="ghost" size="sm" disabled={!commentText.trim() || isSubmitting}>
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                                </Button>
                            </form>
                        </div>
                    </div>
                  </Card>
                </div>
              )}
               {!isLoading && !error && !post && (
                 <Card className="p-8 text-center">
                  <h2 className="text-xl font-semibold">Post not found</h2>
                  <p className="text-muted-foreground mt-2">This post may have been deleted or the URL is incorrect.</p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
