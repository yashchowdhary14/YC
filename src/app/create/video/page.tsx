
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Loader2, CameraOff, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CreateReelPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser to create a Reel.',
          });
        }
      } else {
         setHasCameraPermission(false);
         toast({
            variant: 'destructive',
            title: 'Media Devices Not Supported',
            description: 'Your browser does not support camera access.',
         });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);


  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
             <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-auto p-2">
                <X className="h-7 w-7" />
             </Button>
            {/* Other controls like Flash, Flip Camera will go here */}
        </header>

        {/* Camera Preview */}
        <div className="relative w-full h-full flex items-center justify-center">
             {hasCameraPermission === null && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Starting camera...</p>
                </div>
            )}
             {hasCameraPermission === false && (
                 <div className="p-8">
                    <Alert variant="destructive">
                        <CameraOff className="h-4 w-4"/>
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature.
                        </AlertDescription>
                    </Alert>
                 </div>
            )}
            <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
                playsInline 
                style={{ display: hasCameraPermission ? 'block' : 'none'}}
            />
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center p-8 bg-gradient-to-t from-black/50 to-transparent">
            {/* Record Button */}
            <div className="w-20 h-20 rounded-full bg-transparent border-4 border-white flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive/90 transition-transform active:scale-90"></div>
            </div>
        </footer>
    </div>
  );
}
