'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition, useRef } from 'react';
import {
  ImageIcon,
  Share2,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import type { Post } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { handleCaptionGeneration } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PostCard from '@/components/app/post-card';
import SidebarNav from '@/components/app/sidebar-nav';
import AppHeader from '@/components/app/header';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<Post[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const initialPosts = PlaceHolderImages.map((p, index) => ({
      id: `post-${index}`,
      user: {
        id: `user-${index + 2}`,
        username: `user${index + 2}`,
        fullName: `User ${index + 2}`,
        avatarUrl: `https://picsum.photos/seed/user${index + 2}/100/100`,
      },
      imageUrl: p.imageUrl,
      imageHint: p.imageHint,
      caption: p.description,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * (index + 1)),
      likes: Math.floor(Math.random() * 1000),
      commentsCount: Math.floor(Math.random() * 200),
    }));
    setPosts(initialPosts);
  }, []);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCaption('');
    }
  };

  const generateCaption = () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please upload an image to generate a caption.',
      });
      return;
    }

    setIsGenerating(true);
    startTransition(async () => {
      const result = await handleCaptionGeneration(imagePreview);
      setIsGenerating(false);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Caption Generation Failed',
          description: result.error,
        });
      } else if (result.caption) {
        setCaption(result.caption);
        toast({
          title: 'Caption Generated!',
          description: 'The AI has suggested a caption for your post.',
        });
      }
    });
  };

  const handlePost = () => {
    if (!imagePreview || !caption) {
      toast({
        variant: 'destructive',
        title: 'Cannot create post',
        description: 'Please ensure you have an image and a caption.',
      });
      return;
    }

    if(!user) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: {
        id: user.uid,
        username: user.email?.split('@')[0] || 'anonymous',
        fullName: user.displayName || 'Anonymous User',
        avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
      },
      imageUrl: imagePreview,
      imageHint: 'user uploaded',
      caption: caption,
      createdAt: new Date(),
      likes: 0,
      commentsCount: 0,
    };

    setPosts([newPost, ...posts]);
    setImagePreview(null);
    setImageFile(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        <SidebarFooter>
          <Separator className="my-2" />
          <div className="p-2">
            <Button variant="outline" className="w-full justify-start">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage
                  src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`}
                  alt={user.displayName || ''}
                />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium">{user.displayName || user.email}</span>
                <span className="text-xs text-muted-foreground">
                  @{user.email?.split('@')[0]}
                </span>
              </div>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
              <div className="lg:col-span-2 xl:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1 xl:col-span-1 lg:sticky top-24">
                <Card className="w-full">
                  <CardHeader>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      Create Post
                    </h2>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div
                      className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Selected preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Click to upload an image
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="caption"
                          className="text-sm font-medium"
                        >
                          Caption
                        </label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={generateCaption}
                          disabled={isGenerating || !imagePreview}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          <span className="ml-2">
                            {isGenerating ? 'Generating...' : 'Generate AI Caption'}
                          </span>
                        </Button>
                      </div>
                      <Textarea
                        id="caption"
                        placeholder="What's on your mind?"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handlePost}
                      disabled={isPending || !imagePreview || !caption}
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Share2 className="mr-2 h-4 w-4" />
                      )}
                      Post
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
