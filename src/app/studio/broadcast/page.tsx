
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { Loader2, Video, VideoOff, Wifi, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { dummyStreams, dummyUsers } from '@/lib/dummy-data';

// A simple local storage based state management for dummy data
const updateDummyStreams = (updatedStream: any) => {
  const currentStreams = JSON.parse(localStorage.getItem('dummyStreams') || JSON.stringify(dummyStreams), (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
  });
  const streamIndex = currentStreams.findIndex((s: any) => s.id === updatedStream.id);
  if (streamIndex > -1) {
    currentStreams[streamIndex] = updatedStream;
  }
  localStorage.setItem('dummyStreams', JSON.stringify(currentStreams));
  // Dispatch a storage event to notify other tabs/pages
  window.dispatchEvent(new Event('storage'));
};


export default function BroadcastPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [streamTitle, setStreamTitle] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    } else if (user) {
        const userStream = dummyStreams.find(s => s.streamerId === user.uid);
        if (userStream) {
            setStreamTitle(userStream.title);
            setIsLive(userStream.isLive);
        }
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    const getCameraPermission = async () => {
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
          description: 'Please enable camera permissions in your browser to broadcast.',
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
  
  const handleUpdateStream = useCallback((liveStatus: boolean, newTitle: string) => {
    if(!user) return;
    const userStream = dummyStreams.find(s => s.streamerId === user.uid);
    if (userStream) {
      const updatedStream = {
        ...userStream,
        isLive: liveStatus,
        title: newTitle,
      };
      updateDummyStreams(updatedStream);
    }
  }, [user]);

  const handleGoLive = async () => {
    if (!streamTitle.trim()) {
        toast({ variant: 'destructive', title: 'Stream title is required.'});
        return;
    }
    setIsLoading(true);
    // In a real app, this is where you'd set up the WebRTC connection
    // and update the stream status in Firestore.
    await new Promise(res => setTimeout(res, 1500)); 
    
    handleUpdateStream(true, streamTitle);
    
    setIsLive(true);
    setIsLoading(false);
    toast({ title: 'You are now live!', description: 'Your stream has started successfully.'});
  };

  const handleStopStream = async () => {
    setIsLoading(true);
    // In a real app, close the WebRTC connection and update Firestore.
    await new Promise(res => setTimeout(res, 1000));
    
    handleUpdateStream(false, streamTitle);
    
    setIsLive(false);
    setIsLoading(false);
    toast({ title: 'Stream Ended', description: 'Your broadcast has finished.'});
  };


  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-4">Stream Dashboard</h1>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Manage Your Broadcast</CardTitle>
                        <CardDescription>Setup your stream details and go live to your audience.</CardDescription>
                    </div>
                    {isLive ? (
                        <div className="flex items-center gap-2 text-red-500 font-semibold px-3 py-1 rounded-md bg-red-500/10">
                            <Wifi className="h-4 w-4"/>
                            <span>Live</span>
                        </div>
                    ) : (
                         <div className="flex items-center gap-2 text-muted-foreground font-semibold px-3 py-1 rounded-md bg-secondary">
                            <VideoOff className="h-4 w-4"/>
                            <span>Offline</span>
                        </div>
                    )}
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stream-title">Stream Title</Label>
                    <Input 
                        id="stream-title"
                        placeholder="My Awesome Live Stream"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        disabled={isLive || isLoading}
                    />
                  </div>
                  <div>
                    {isLive ? (
                        <Button onClick={handleStopStream} variant="destructive" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <VideoOff className="mr-2 h-4 w-4"/>}
                            Stop Stream
                        </Button>
                    ) : (
                        <Button onClick={handleGoLive} className="w-full" disabled={isLoading || hasCameraPermission === false}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4"/>}
                            Go Live
                        </Button>
                    )}
                  </div>
                  {isLive && (
                     <Button onClick={() => handleUpdateStream(true, streamTitle)} variant="outline" className="w-full" disabled={isLoading}>
                        <Check className="mr-2 h-4 w-4"/>
                        Update Stream Info
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-4 aspect-video">
                    {hasCameraPermission === null && (
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Requesting camera access...</p>
                        </div>
                    )}
                    {hasCameraPermission === false && (
                         <Alert variant="destructive">
                            <VideoOff className="h-4 w-4"/>
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                    <video ref={videoRef} className="w-full h-full rounded-md object-cover" autoPlay muted playsInline style={{ display: hasCameraPermission ? 'block' : 'none'}}/>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
