
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function StudioPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

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

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
      // Cleanup: stop all tracks when the component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  if (isUserLoading || hasPermission === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-black">
      {hasPermission ? (
        <div className="relative h-full w-full">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
          />
          {/* We will add camera controls and capture buttons here in the next step */}
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
