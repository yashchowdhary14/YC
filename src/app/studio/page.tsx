'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, VideoOff, Camera, Check, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCapturedMedia } from '@/lib/captured-media-store';
import { motion } from 'framer-motion';

export default function StudioPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { setCapturedMedia } = useCapturedMedia();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Devices Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      
      stopStream();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: facingMode } 
        });
        streamRef.current = stream;
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser to continue.',
        });
      }
    };

    getCameraPermission();

    return () => {
      stopStream();
    };
  }, [toast, facingMode, stopStream]);
  
  const handleCapture = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                setCapturedMedia(file);
                router.push('/create/post');
            } else {
                toast({ variant: 'destructive', title: 'Failed to capture image.' });
                setIsCapturing(false);
            }
        }, 'image/jpeg', 0.95);
    }
  };

  const handleFlipCamera = () => {
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }

  if (isUserLoading || hasPermission === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-black flex flex-col">
        <div className="absolute top-4 left-4 z-20">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white bg-black/50 hover:bg-black/70 hover:text-white rounded-full">
                <X />
            </Button>
        </div>
         <div className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon" onClick={handleFlipCamera} className="text-white bg-black/50 hover:bg-black/70 hover:text-white rounded-full">
                <SwitchCamera />
            </Button>
        </div>
      {hasPermission ? (
        <div className="relative h-full w-full flex flex-col justify-end">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="relative p-8 z-10 bg-gradient-to-t from-black/70 to-transparent">
             <div className="flex items-center justify-center mb-4">
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-transparent border-4 border-white flex items-center justify-center cursor-pointer"
                    onClick={handleCapture}
                >
                    <div className="w-[60px] h-[60px] rounded-full bg-white/90"></div>
                </motion.div>
             </div>
             <Tabs defaultValue="post" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent">
                    <TabsTrigger value="post" className="text-white/60 data-[state=active]:text-white data-[state=active]:font-bold">Post</TabsTrigger>
                    <TabsTrigger value="story" className="text-white/60 data-[state=active]:text-white data-[state=active]:font-bold">Story</TabsTrigger>
                    <TabsTrigger value="reel" className="text-white/60 data-[state=active]:text-white data-[state=active]:font-bold">Reel</TabsTrigger>
                </TabsList>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <VideoOff className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              YCP needs access to your camera to create posts, stories, and reels. Please grant
              permission in your browser's settings and refresh the page.
            </AlertDescription>
          </Alert>
           <Button onClick={() => router.push('/create')} variant="outline" className="mt-4">
              Go Back
           </Button>
        </div>
      )}
    </main>
  );
}

const X = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
