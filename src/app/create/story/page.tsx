'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CreateStoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for stories
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 10MB.',
        });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaPreview) {
      toast({ variant: 'destructive', title: 'Please upload an image or video.' });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
    
    toast({
      title: 'Story Posted! (Simulation)',
      description: 'Your story has been added.',
    });
    
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center bg-background pt-14 min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">Add to your story</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="relative aspect-[9/16] bg-muted/40 flex items-center justify-center rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaPreview ? (
                    <Image src={mediaPreview} alt="Story preview" fill className="object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer p-8 text-center">
                        <UploadCloud className="h-12 w-12" />
                        <h3 className="font-semibold text-lg">Tap to upload</h3>
                        <p className="text-sm">Share a photo or video.</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMediaChange}
                />
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full mt-4" disabled={isSubmitting || !mediaPreview}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Add to your story"}
          </Button>
        </form>
      </div>
    </div>
  );
}
