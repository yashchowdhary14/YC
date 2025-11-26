
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CreateStoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If no media is loaded, trigger the file input.
    if (!mediaFile && fileInputRef.current) {
        fileInputRef.current.click();
    }
  }, [mediaFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    } else {
        router.back();
    }
  };

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

  const PageLoader = () => (
     <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-background pt-14 min-h-[calc(100vh-3.5rem)]">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
        <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  if (!mediaPreview) {
    return <PageLoader />;
  }

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
                {mediaPreview && (
                    <Image src={mediaPreview} alt="Story preview" fill className="object-cover" />
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
