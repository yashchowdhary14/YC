
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, UploadCloud, Wand2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { generateAiCaption, GenerateAiCaptionInput } from '@/ai/flows/generate-ai-caption';

export default function CreatePostPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleGenerateCaption = async () => {
    if (!imageFile) {
        toast({ variant: 'destructive', title: 'Please upload an image first.' });
        return;
    }
    setIsGenerating(true);
    try {
        const dataUri = await fileToDataUri(imageFile);
        const input: GenerateAiCaptionInput = {
            mediaDataUri: dataUri,
        };
        const result = await generateAiCaption(input);
        setCaption(result.caption);
    } catch (error) {
        console.error("Error generating caption:", error);
        toast({ variant: 'destructive', title: 'Failed to generate caption.' });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !caption.trim() || !user) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please upload an image and write a caption.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate upload and post creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Simulating post creation:', {
      userId: user.uid,
      caption: caption,
      imageName: imageFile.name,
    });

    toast({
      title: 'Post Created! (Simulation)',
      description: 'Your post has been successfully shared.',
    });
    
    router.push('/');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-background pt-14">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Create New Post</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-0 lg:grid lg:grid-cols-2 lg:gap-0">
              <div className="relative aspect-square bg-muted/40 flex items-center justify-center lg:rounded-l-lg">
                {imagePreview ? (
                    <Image src={imagePreview} alt="Image preview" fill className="object-contain lg:rounded-l-lg" />
                ) : (
                    <div 
                        className="flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer p-8 text-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud className="h-12 w-12" />
                        <h3 className="font-semibold text-lg">Click to upload an image</h3>
                        <p className="text-sm">PNG, JPG, or GIF (max 4MB)</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                />
              </div>

              <div className="p-6 flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-lg flex-1">Write a caption</h2>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateCaption}
                        disabled={!imageFile || isGenerating}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        <span className="ml-2 hidden sm:inline">Generate with AI</span>
                    </Button>
                </div>
                <Textarea
                  placeholder="What's on your mind?"
                  className="flex-1 resize-none min-h-[200px] lg:min-h-0"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !imageFile || !caption.trim()}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                  {isSubmitting ? 'Sharing...' : 'Share Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

