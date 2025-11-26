
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
import { useUser } from '@/firebase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { dummyUsers } from '@/lib/dummy-data';
import { generateAiCaption } from '@/ai/flows/generate-ai-caption';
import { fileToDataUri } from '@/lib/utils';

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

  const profile = useMemo(() => {
    if (!user) return null;
    const userProfileData = dummyUsers.find(u => u.id === user.uid);
    return {
      ...userProfileData,
      username: userProfileData?.username || user.email?.split('@')[0] || 'user',
      profilePhoto: userProfileData ? `https://picsum.photos/seed/${user.uid}/150/150` : user.photoURL,
    };
  }, [user]);

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
      const mediaDataUri = await fileToDataUri(image.file);
      const result = await generateAiCaption({
        mediaDataUri,
        userProfile: profile ? {
          username: profile.username,
          bio: profile.bio || '',
          followers: [], // Dummy data, can be expanded
          following: [],
        } : undefined,
      });

      if (result.caption) {
        form.setValue('caption', result.caption);
        toast({
          title: 'Caption Generated!',
          description: 'The AI has suggested a caption for your post.',
        });
      } else {
        throw new Error('AI did not return a caption.');
      }
    } catch (error) {
      console.error('Error generating AI caption:', error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: 'Could not generate a caption. Please try again.',
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
    await new Promise(r => setTimeout(r, 1000)); // Simulate form submission

    toast({
      title: 'Post Created!',
      description: 'Your post has been successfully shared (simulation).',
    });
    router.push('/profile');
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-background pt-14">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
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
          <div className="flex flex-col p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={profile?.profilePhoto || ''} />
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
                                            <Label htmlFor="comments-off" className="text-sm">Turn off commenting</Label>												<Switch id="comments-off" checked={field.value} onCheckedChange={field.onChange} />
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
    </div>
  );
}
