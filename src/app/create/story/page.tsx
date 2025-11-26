
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCapturedMedia } from '@/lib/captured-media-store';

export default function CreateStoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { capturedMedia, setCapturedMedia } = useCapturedMedia();
  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If there's no captured media, the user shouldn't be on this page.
  // Redirect them immediately.
  if (!capturedMedia) {
    if (typeof window !== 'undefined') {
      router.replace('/create');
    }
    return null;
  }

  useEffect(() => {
    // This effect now only runs when there IS captured media.
    const file = capturedMedia;
    setMediaFile(file);
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
    
    // Clean up the captured media so it's not reused
    setCapturedMedia(null);
    
    // Cleanup URL object when component unmounts
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [capturedMedia, setCapturedMedia]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      toast({ variant: 'destructive', title: 'No media to post.' });
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
              >
                {mediaPreview ? (
                    <Image src={mediaPreview} alt="Story preview" fill className="object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-8 text-center">
                        <Loader2 className="h-12 w-12 animate-spin" />
                        <h3 className="font-semibold text-lg">Loading media...</h3>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full mt-4" disabled={isSubmitting || !mediaFile}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Add to your story"}
          </Button>
        </form>
      </div>
    </div>
  );
}
