'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Loader2, Video, FileCheck2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MAX_DURATION_SECONDS = 120; // 2 minutes

export default function CreateReelPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input on component mount if no file is selected
  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
        fileInputRef.current.click();
    }
  }, [selectedFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please select a video file.'
        });
        return;
      }
      
      setIsProcessing(true);
      
      // Validate video duration
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > MAX_DURATION_SECONDS) {
           toast({
                variant: 'destructive',
                title: 'Video Too Long',
                description: `Please select a video under ${MAX_DURATION_SECONDS / 60} minutes.`
           });
           setIsProcessing(false);
           if (fileInputRef.current) {
               fileInputRef.current.value = '';
           }
        } else {
           setSelectedFile(file);
           setPreviewUrl(URL.createObjectURL(file));
           setIsProcessing(false);
        }
      };
      videoElement.src = URL.createObjectURL(file);

    } else {
        // If user cancels file selection, go back to create page.
        if (!selectedFile) {
            router.back();
        }
    }
  };

  const handleShare = async () => {
    if (!selectedFile) {
        toast({ variant: 'destructive', title: 'No video selected' });
        return;
    }
    setIsLoading(true);
    // Simulate the upload and post creation logic
    await new Promise(r => setTimeout(r, 2000));
    setIsLoading(false);
    toast({ title: 'Reel posted!', description: 'Your reel is now live (simulation).' });
    router.push('/reels');
  }
  
  const PageLoader = () => (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="font-semibold">Processing Video...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
        </div>
  )

  if (isProcessing) {
      return <PageLoader />;
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 pt-20">
        {/* Hidden File Input */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="video/*" 
        />

        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background border-b">
             <h1 className="text-xl font-bold">New Reel</h1>
             <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-auto p-2">
                <X className="h-6 w-6" />
             </Button>
        </header>
        
        {previewUrl ? (
             <div className="w-full max-w-lg space-y-6">
                 <Card>
                    <CardContent className="p-4">
                        <div className="aspect-video bg-black rounded-md overflow-hidden">
                            <video src={previewUrl} controls className="w-full h-full" />
                        </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea id="caption" placeholder="Write a caption..." />
                        </div>
                         <Button onClick={handleShare} className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Share
                         </Button>
                    </CardContent>
                 </Card>
            </div>
        ) : (
             <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4">
                <div className="max-w-md">
                     <Alert>
                        <Video className="h-4 w-4"/>
                        <AlertTitle>Select a video to start</AlertTitle>
                        <AlertDescription>
                            Click the button below to choose a video from your gallery. Videos must be under 2 minutes long.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => fileInputRef.current?.click()} className="mt-6">
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Select from Gallery
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
}
