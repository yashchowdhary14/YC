
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UploadVideoPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for videos
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a video smaller than 50MB.',
        });
        return;
      }
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please upload a video and provide a title.',
      });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate longer upload
    
    toast({
      title: 'Video Uploaded! (Simulation)',
      description: `Your video "${title}" is now processing.`,
    });
    
    router.push('/videos');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-background pt-14">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Upload Video</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
                <CardTitle>Video Details</CardTitle>
                <CardDescription>Provide information about your video and upload the file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div 
                    className="relative aspect-video w-full bg-muted/40 rounded-lg flex items-center justify-center border-2 border-dashed cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {videoPreview ? (
                        <video src={videoPreview} controls className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-8 text-center">
                            <Video className="h-12 w-12" />
                            <h3 className="font-semibold text-lg">Click to upload a video</h3>
                            <p className="text-sm">MP4, MOV, or AVI (max 50MB)</p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/quicktime,video/x-msvideo"
                        className="hidden"
                        onChange={handleVideoChange}
                    />
                </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                    id="title" 
                    placeholder="Your awesome video title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell viewers about your video"
                  className="resize-y min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !videoFile || !title.trim()}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                {isSubmitting ? 'Uploading...' : 'Upload Video'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

