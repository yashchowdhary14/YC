
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
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Loader2, Video, VideoOff, Wifi, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LiveChat from '@/components/live/live-chat';
import type { Stream, User } from '@/lib/types';
import { dummyUsers } from '@/lib/dummy-data';


export default function BroadcastPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [streamTitle, setStreamTitle] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  
  // In a real app, a user might manage multiple stream keys or have one created.
  // For this demo, we'll create a stream document for the user if it doesn't exist.
  const streamId = useMemo(() => user?.uid, [user]);

  const streamRef = useMemoFirebase(() => {
    if (!firestore || !streamId) return null;
    return doc(firestore, 'streams', streamId);
  }, [firestore, streamId]);

  const { data: streamData, isLoading: isStreamLoading } = useDoc<Stream>(streamRef);

  useEffect(() => {
    // If stream data exists, populate the component state
    if (streamData) {
        setStreamTitle(streamData.title);
        setIsLive(streamData.isLive);
    } 
    // If no stream document and we have a user, create one.
    else if (!isStreamLoading && !streamData && user && streamRef) {
        const userData = dummyUsers.find(u => u.id === user.uid);
        if (!userData) return;

        const newStreamData: Omit<Stream, 'id'> = {
            streamerId: user.uid,
            title: `${userData.username}'s Stream`,
            category: 'Just Chatting',
            tags: ['IRL', 'New Streamer'],
            viewerCount: 0,
            isLive: false,
            thumbnailUrl: `https://picsum.photos/seed/${user.uid}/640/360`,
            user: {
                id: userData.id,
                username: userData.username,
                avatarUrl: `https://picsum.photos/seed/${userData.id}/100/100`,
                fullName: userData.fullName,
                bio: userData.bio,
                followersCount: userData.followersCount,
                followingCount: userData.followingCount,
                verified: userData.verified
            }
        };
        setDoc(streamRef, newStreamData).catch(err => {
            console.error("Failed to create stream document:", err);
            toast({ variant: 'destructive', title: 'Could not initialize your stream.'});
        });
    }
  }, [streamData, isStreamLoading, user, streamRef, toast]);


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
    if(!streamRef) return;
    setIsLoading(true);
    try {
        await updateDoc(streamRef, {
            isLive: liveStatus,
            title: newTitle,
            viewerCount: liveStatus ? Math.floor(Math.random() * 5000) + 100 : 0, // Simulate viewers
        });
        toast({ title: `Stream ${liveStatus ? 'started' : 'ended'} successfully!` });
    } catch (error) {
        console.error("Error updating stream:", error);
        toast({ variant: 'destructive', title: "Failed to update stream." });
    } finally {
        setIsLoading(false);
    }
  }, [streamRef, toast]);


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
    if (!streamRef || !streamTitle.trim()) {
        toast({ variant: 'destructive', title: 'Stream title cannot be empty.'});
        return;
    }
    updateDoc(streamRef, { title: streamTitle })
        .then(() => toast({ title: 'Stream info updated!' }))
        .catch(() => toast({ variant: 'destructive', title: 'Failed to update info.' }));
  }


  if (isUserLoading || !user || isStreamLoading || !streamData) {
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
                        <Button onClick={handleUpdateInfo} variant="outline" className="w-full" disabled={isLoading}>
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
                <LiveChat stream={streamData} />
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    