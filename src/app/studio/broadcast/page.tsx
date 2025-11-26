
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import LiveChat from '@/components/live/live-chat';
import type { Stream, LiveChatMessage } from '@/lib/types';
import { dummyStreams } from '@/lib/dummy-data';


export default function BroadcastPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [allStreams, setAllStreams] = useState<Stream[]>(dummyStreams);
  const [streamTitle, setStreamTitle] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const streamData = useMemo(() => {
    return allStreams.find(s => s.streamerId === user?.uid);
  }, [allStreams, user]);

  useEffect(() => {
     // Listen for storage changes to sync state across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dummyStreams' && event.newValue) {
        const updatedStreams = JSON.parse(event.newValue);
        setAllStreams(updatedStreams);
        const myStream = updatedStreams.find((s: Stream) => s.streamerId === user?.uid);
        if (myStream) {
            setIsLive(myStream.isLive);
            setStreamTitle(myStream.title);
        }
      }
    };
    
    // Load initial state from localStorage
    const storedStreams = localStorage.getItem('dummyStreams');
    if (storedStreams) {
        setAllStreams(JSON.parse(storedStreams));
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user?.uid]);

  useEffect(() => {
    if (streamData) {
        setStreamTitle(streamData.title);
        setIsLive(streamData.isLive);
    }
  }, [streamData]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

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
            description: 'Please enable camera permissions in your browser to broadcast.',
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
  
  const handleUpdateStream = useCallback(async (liveStatus: boolean, newTitle: string) => {
    if(!streamData) return;
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    const updatedStreams = allStreams.map(s => {
        if (s.id === streamData.id) {
            return { 
                ...s, 
                isLive: liveStatus, 
                title: newTitle,
                viewerCount: liveStatus ? s.viewerCount || Math.floor(Math.random() * 5000) + 100 : 0
            };
        }
        return s;
    });

    setAllStreams(updatedStreams);
    localStorage.setItem('dummyStreams', JSON.stringify(updatedStreams));
    
    // Manually dispatch a storage event for the current tab to listen to
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'dummyStreams',
        newValue: JSON.stringify(updatedStreams),
    }));

    toast({ title: `Stream ${liveStatus ? 'started' : 'ended'} successfully!` });
    setIsLoading(false);
  }, [streamData, allStreams, toast]);


  const handleGoLive = () => {
    if (!streamTitle.trim()) {
        toast({ variant: 'destructive', title: 'Stream title is required.'});
        return;
    }
    handleUpdateStream(true, streamTitle);
  };

  const handleStopStream = () => {
    handleUpdateStream(false, streamTitle);
  };

  const handleUpdateInfo = () => {
    if (!streamData || !streamTitle.trim()) {
        toast({ variant: 'destructive', title: 'Stream title cannot be empty.'});
        return;
    }
    handleUpdateStream(isLive, streamTitle);
  }


  if (isUserLoading || !user || !streamData) {
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
        <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 min-h-[calc(100vh-4rem)]">
            <div className="md:col-span-2 lg:col-span-3 p-4 sm:p-6 lg:p-8">
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
                            disabled={isLoading}
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
                        <Button onClick={handleUpdateInfo} variant="outline" className="w-full" disabled={isLoading && streamTitle !== streamData.title}>
                            {isLoading && streamTitle !== streamData.title ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4"/>}
                            Update Stream Info
                        </Button>
                    )}
                    </div>
                    <div className="relative flex flex-col items-center justify-center bg-muted rounded-lg p-4 aspect-video">
                        <video ref={videoRef} className="w-full h-full rounded-md object-cover" autoPlay muted playsInline style={{ display: hasCameraPermission ? 'block' : 'none'}}/>
                        
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
                    </div>
                </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 lg:col-span-1 border-l h-[calc(100vh-4rem)] hidden md:flex">
                <LiveChat stream={streamData} messages={chatMessages} setMessages={setChatMessages} />
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
