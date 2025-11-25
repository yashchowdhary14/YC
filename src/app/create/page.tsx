'use client';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleCaptionGeneration, handleCreatePost } from '@/app/actions';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { doc } from 'firebase/firestore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';


const createPostSchema = z.object({
  caption: z.string().max(2200, 'Caption is too long.'),
  location: z.string().max(100, 'Location is too long.').optional(),
  altText: z.string().max(250, 'Alt text is too long.').optional(),
  hideLikes: z.boolean().default(false),
  commentsOff: z.boolean().default(false),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export default function CreatePage() {
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfileData } = useDoc(userDocRef);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: '',
      location: '',
      altText: '',
      hideLikes: false,
      commentsOff: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select an image smaller than 4MB.',
        });
        return;
      }
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleGenerateCaption = async () => {
    if (!image) return;
    setIsGenerating(true);
    try {
      const result = await handleCaptionGeneration(image.preview);
      if (result.caption) {
        form.setValue('caption', result.caption);
        toast({
          title: 'Caption Generated!',
          description: 'The AI has suggested a caption for your post.',
        });
      } else {
        throw new Error(result.error || 'Failed to generate caption.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: error.message || 'Could not generate a caption. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const onSubmit = async (data: CreatePostFormValues) => {
    if (!image || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Image and user are required.'});
        return;
    }
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('caption', data.caption);
      formData.append('location', data.location || '');
      formData.append('userId', user.uid);
      formData.append('altText', data.altText || '');
      formData.append('hideLikes', String(data.hideLikes));
      formData.append('commentsOff', String(data.commentsOff));

      await handleCreatePost(formData);
      
      toast({
        title: 'Post Created!',
        description: 'Your post has been successfully shared.',
      });
      router.push('/profile');
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Failed to create post',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  

  const profile = useMemo(() => {
    if (!user || !userProfileData) return null;
    return {
      username: userProfileData.username || user.email?.split('@')[0] || 'user',
      profilePhoto: userProfileData.profilePhoto || user.photoURL || `https://picsum.photos/seed/${user.uid}/150/150`,
    };
  }, [user, userProfileData]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-background">
          <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image Upload and Preview */}
              <div className="relative flex items-center justify-center p-4 bg-muted aspect-square">
                {image ? (
                  <>
                    <Image
                      src={image.preview}
                      alt="Post preview"
                      fill
                      className="object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 z-10 rounded-full h-8 w-8"
                      onClick={() => setImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 4MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>

              {/* Form Section */}
              <div className="flex flex-col p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={profile?.profilePhoto} />
                    <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{profile?.username}</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                    <div className="flex-1">
                        <Controller
                            name="caption"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                {...field}
                                placeholder="Write a caption..."
                                className="resize-none h-32 border-0 focus-visible:ring-0 p-0"
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGenerateCaption}
                            disabled={!image || isGenerating || isSubmitting}
                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                            >
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate with AI
                        </Button>
                        <Controller
                            name="location"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                {...field}
                                placeholder="Add location"
                                className="bg-transparent border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
                                />
                            )}
                        />
                        <Accordion type="single" collapsible className="w-full">
                           <AccordionItem value="alt-text">
                               <AccordionTrigger className="p-0 hover:no-underline text-base">Accessibility</AccordionTrigger>
                               <AccordionContent className="space-y-2 pt-2">
                                   <p className="text-xs text-muted-foreground">Alt text describes your photos for people with visual impairments.</p>
                                    <Controller
                                        name="altText"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                            {...field}
                                            placeholder="Write alt text..."
                                            className="bg-muted"
                                            />
                                        )}
                                    />
                               </AccordionContent>
                           </AccordionItem>
                           <AccordionItem value="advanced-settings" className="border-b-0">
                               <AccordionTrigger className="p-0 hover:no-underline text-base">Advanced Settings</AccordionTrigger>
                               <AccordionContent className="space-y-4 pt-2">
                                   <Controller
                                        name="hideLikes"
                                        control={form.control}
                                        render={({ field }) => (
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="hide-likes" className="text-sm">Hide like and view counts on this post</Label>
                                                <Switch id="hide-likes" checked={field.value} onCheckedChange={field.onChange} />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="commentsOff"
                                        control={form.control}
                                        render={({ field }) => (
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="comments-off" className="text-sm">Turn off commenting</Label>
                                                <Switch id="comments-off" checked={field.value} onCheckedChange={field.onChange} />
                                            </div>
                                        )}
                                    />
                               </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="mt-4">
                        <Button
                        type="submit"
                        disabled={!image || isSubmitting}
                        className="w-full"
                        >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Share
                        </Button>
                    </div>
                </form>
              </div>
            </div>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
