
'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { formatCompactNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share, Download, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import RelatedVideoCard from '@/components/app/related-video-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';
import type { Post, VideoComment, User } from '@/lib/types';
import TextareaAutosize from 'react-textarea-autosize';
import { dummyPosts, dummyUsers } from '@/lib/dummy-data';

function WatchPageSkeleton() {
  return (
    <div className="container mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-xl mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/4 mb-4" />
          <Separator className="my-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 mb-1" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Separator className="my-4" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="aspect-video w-40 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateDummyComments(count: number): VideoComment[] {
    const comments: VideoComment[] = [];
    for (let i = 0; i < count; i++) {
        const user = dummyUsers[i % dummyUsers.length];
        comments.push({
            id: `comment-${i}-${Date.now()}`,
            text: `This is a great dummy comment! #${i + 1}`,
            createdAt: new Date(Date.now() - (i + 1) * 60000 * Math.random() * 10),
            user: { ...user, avatarUrl: `https://picsum.photos/seed/${user.id}/100/100` } as User
        });
    }
    return comments.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function CommentSection({ videoId }: { videoId: string }) {
    const { user: currentUser } = useUser();
    const [commentText, setCommentText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [comments, setComments] = useState<VideoComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching comments
        setTimeout(() => {
            setComments(generateDummyComments(5));
            setIsLoading(false);
        }, 500);
    }, [videoId]);
    
    const handleAddComment = async () => {
        if (!commentText.trim() || !currentUser) return;
        setIsSending(true);

        const newComment: VideoComment = {
            id: `new-comment-${Date.now()}`,
            text: commentText,
            createdAt: new Date(),
            user: {
              id: currentUser.uid,
              username: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              avatarUrl: currentUser.photoURL || `https://picsum.photos/seed/${currentUser.uid}/100`,
              fullName: currentUser.displayName || 'User',
              bio: '',
              followersCount: 0,
              followingCount: 0,
              verified: false,
            }
        };

        // Simulate network request
        await new Promise(res => setTimeout(res, 300));
        
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        setIsSending(false);
    };


    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">{comments?.length || 0} Comments</h2>
             {currentUser && (
                <div className="flex items-start gap-3 mb-6">
                    <Avatar>
                        <AvatarImage src={currentUser.photoURL || ''} />
                        <AvatarFallback>{currentUser.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                         <TextareaAutosize
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-transparent border-b focus:border-primary focus-visible:ring-0 px-0 resize-none"
                            disabled={isSending}
                            minRows={1}
                        />
                        {commentText && (
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="ghost" size="sm" onClick={() => setCommentText('')}>Cancel</Button>
                                <Button size="sm" onClick={handleAddComment} disabled={isSending}>
                                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Comment
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="space-y-6">
                {isLoading && Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                ))}
                {comments?.map(comment => (
                    <div key={comment.id} className="flex items-start gap-3">
                        <Avatar>
                            <AvatarImage src={comment.user.avatarUrl} />
                            <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">{comment.user.username}</span>
                                <time className="text-muted-foreground text-xs">
                                  {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now'}
                                </time>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  
  const video = useMemo(() => dummyPosts.find(p => p.id === videoId && p.type === 'video'), [videoId]);
  
  const relatedVideos = useMemo(() => {
    if (!video) return [];
    const category = video.tags.find(t => t !== 'longform');
    return dummyPosts.filter(p => p.type === 'video' && p.tags.includes(category!) && p.id !== video.id);
  }, [video]);

  useEffect(() => {
    setIsVideoLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsVideoLoading(false);
    }, 500);
  }, [videoId]);


  if (isVideoLoading) {
    return (
      <main className="min-h-screen bg-background"><WatchPageSkeleton /></main>
    );
  }

  if (!video) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-background">
        <div className="container mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted mb-4">
                <video
                  src={video.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">{video.caption}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatCompactNumber(video.views)} views</span>
                  <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : ''}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                      <Avatar>
                          <AvatarImage src={video.user.avatarUrl} />
                          <AvatarFallback>{video.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold">{video.user.username}</p>
                          <p className="text-sm text-muted-foreground">{formatCompactNumber(video.user.followersCount || 0)} followers</p>
                      </div>
                      <Button variant="secondary" className="ml-4 rounded-full font-bold">Follow</Button>
                  </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-full bg-secondary">
                          <Button variant="secondary" className="rounded-r-none rounded-l-full">
                              <ThumbsUp className="mr-2 h-4 w-4"/>
                              {formatCompactNumber(video.likes)}
                          </Button>
                          <Separator orientation="vertical" className="h-6"/>
                          <Button variant="secondary" className="rounded-l-none rounded-r-full">
                              <ThumbsDown />
                          </Button>
                      </div>
                      <Button variant="secondary" className="rounded-full">
                          <Share className="mr-2 h-4 w-4"/>
                          Share
                      </Button>
                        <Button variant="secondary" className="rounded-full">
                          <Download className="mr-2 h-4 w-4"/>
                          Download
                      </Button>
                  </div>
              </div>
                <Separator className="my-4" />
                <div className="p-4 rounded-lg bg-secondary text-sm">
                  <p className="font-bold">About this video:</p>
                  <p className="whitespace-pre-wrap mt-2">
                    This is a placeholder for the video description. In a real application, this would be a detailed summary of the video content, including links, chapters, and other relevant information to give viewers context.
                  </p>
                </div>
                <CommentSection videoId={videoId} />
            </div>
            <div className="lg:col-span-1">
                <h2 className="text-xl font-bold mb-4">Up next</h2>
                <div className="space-y-4">
                  {relatedVideos?.map(relatedVideo => (
                      <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
                  ))}
                </div>
            </div>
          </div>
        </div>
    </main>
  );
}
