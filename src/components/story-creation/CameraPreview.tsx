
'use client';

import { useEffect, RefObject } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CameraOff } from 'lucide-react';
import { useState } from 'react';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement>;
  facingMode: 'user' | 'environment';
  flashEnabled: boolean;
}

export default function CameraPreview({
  videoRef,
  facingMode,
}: CameraPreviewProps) {
  const { toast } = useToast();
  const [permissionState, setPermissionState] = useState<'loading' | 'granted' | 'denied'>('loading');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let currentTrack: MediaStreamTrack | null = null;

    const getCameraStream = async () => {
      try {
        setPermissionState('loading');
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: true, // Request audio for video recording later
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          currentTrack = stream.getVideoTracks()[0];
          setPermissionState('granted');
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setPermissionState('denied');
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraStream();

    return () => {
      // Cleanup: stop the camera stream when the component unmounts or deps change
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, toast, videoRef]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {permissionState === 'loading' && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Starting camera...</p>
          </div>
      )}
      {permissionState === 'denied' && (
           <div className="flex flex-col items-center gap-2 text-destructive">
              <CameraOff className="h-12 w-12" />
              <p className="font-semibold">Camera access denied</p>
          </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted // Mute to prevent audio feedback from the mic
        style={{ display: permissionState === 'granted' ? 'block' : 'none'}}
      />
    </div>
  );
}
