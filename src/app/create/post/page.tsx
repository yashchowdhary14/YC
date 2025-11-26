
'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Wand2, Loader2, Crop, Sliders, Check, Tag, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri, uploadFile } from '@/lib/utils';
import { generateAiCaption, GenerateAiCaptionInput } from '@/ai/flows/generate-ai-caption';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useCapturedMedia } from '@/lib/captured-media-store';
import { usePostCreationStore } from '@/lib/post-creation-store';
import { AnimatePresence, motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import PostCarousel from '@/components/post-creation/PostCarousel';
import EditControls from '@/components/post-creation/EditControls';
import DetailsForm from '@/components/post-creation/DetailsForm';

type PostCreationStep = 'crop' | 'edit' | 'details' | 'sharing';

export default function CreatePostPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { capturedMedia, setCapturedMedia } = useCapturedMedia();

  const {
    media,
    addMedia,
    setCaption,
    isGeneratingCaption,
    isSubmitting,
    startCaptionGeneration,
    finishCaptionGeneration,
    startSubmitting,
    finishSubmitting,
    reset,
  } = usePostCreationStore();
  
  const [step, setStep] = useState<PostCreationStep>('edit');

  useEffect(() => {
    // If there's no media in the store AND no media was just captured,
    // the user shouldn't be here.
    if (media.length === 0 && !capturedMedia) {
        if (typeof window !== 'undefined') {
          router.replace('/create');
        }
        return;
    }

    if (capturedMedia) {
      const file = capturedMedia;
      const previewUrl = URL.createObjectURL(file);
      addMedia({
        id: `media_${Date.now()}`,
        file,
        previewUrl,
        type: file.type.startsWith('video') ? 'video' : 'photo',
      });
      // Clean up the captured media so it's not reused
      setCapturedMedia(null);
    }
  }, [capturedMedia, addMedia, media.length, router, setCapturedMedia]);
  
  const headerText = useMemo(() => {
    switch (step) {
      case 'crop': return 'Crop';
      case 'edit': return 'Edit';
      case 'details': return 'New post';
      case 'sharing': return 'Sharing...';
      default: return 'Create post';
    }
  }, [step]);
  
  const handleNext = () => {
    if (step === 'crop') setStep('edit');
    else if (step === 'edit') setStep('details');
  };
  
  const handleBack = () => {
    if (step === 'details') setStep('edit');
    else if (step === 'edit') setStep('crop');
    else if (step === 'crop') {
        reset();
        router.back();
    }
  };

  const handleShare = async () => {
    const { caption, media } = usePostCreationStore.getState();
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to share a post.'});
      return;
    }
    if (media.length === 0) {
      toast({ variant: 'destructive', title: 'Please add at least one photo or video.'});
      return;
    }
    startSubmitting();
    setStep('sharing');

    try {
      // Simulate upload and Firestore document creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload each file in `media` to storage
      // and then create a post document with all the media URLs.
      // const imageUrl = await uploadFile(media[0].file, `posts/${user.uid}/${Date.now()}_${media[0].file.name}`);
      // await addDoc(collection(firestore, 'posts'), { ... });
      
      toast({ title: 'Post Shared! (Simulation)', description: 'Your post is now live on your profile.'});
      reset();
      const username = user.displayName || user.email?.split('@')[0];
      router.push(`/${username}`);

    } catch(error) {
      console.error("Error sharing post:", error);
      toast({ variant: 'destructive', title: 'Failed to share post.', description: 'An unexpected error occurred.' });
      setStep('details'); // Go back to details screen on failure
    } finally {
      finishSubmitting();
    }
  };

  const handleGenerateCaption = async () => {
    if (media.length === 0) {
        toast({ variant: 'destructive', title: 'Please add an image first.' });
        return;
    }
    startCaptionGeneration();
    try {
        const dataUri = await fileToDataUri(media[0].file);
        const input: GenerateAiCaptionInput = {
            mediaDataUri: dataUri,
            userProfile: {
                username: user?.displayName || 'user',
                bio: '',
                followers: [],
                following: []
            }
        };
        const result = await generateAiCaption(input);
        setCaption(result.caption);
    } catch (error) {
        console.error("Error generating caption:", error);
        toast({ variant: 'destructive', title: 'Failed to generate caption.' });
    } finally {
        finishCaptionGeneration();
    }
  };


  const steps: Record<PostCreationStep, ReactNode> = {
    crop: <PostCarousel />,
    edit: <PostCarousel />,
    details: <DetailsForm onGenerateCaption={handleGenerateCaption} />,
    sharing: (
      <div className="flex flex-col items-center justify-center h-full text-foreground">
        <div className="w-full aspect-square bg-black flex items-center justify-center relative">
            <AnimatePresence>
                {media.length > 0 && (
                    <motion.div
                        key={media[0].id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full"
                    >
                        <Image 
                            src={media[0].previewUrl} 
                            alt="final preview" 
                            fill 
                            className="object-contain filter blur-sm"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-white" />
                <p className="text-lg text-white">Sharing your post...</p>
            </div>
        </div>
      </div>
    )
  };
  
  // If user lands here without media from the studio, redirect them.
  if (media.length === 0 && !capturedMedia) {
    if (typeof window !== 'undefined') {
      router.replace('/create');
    }
    return null; // Return null to prevent rendering anything while redirecting
  }
  
  if (media.length === 0) {
     return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
      <div className="w-full h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-2 flex-shrink-0 h-14">
          <Button variant="ghost" size="icon" onClick={handleBack} disabled={isSubmitting}>
            <ArrowLeft />
          </Button>
          <h1 className="font-semibold text-lg">{headerText}</h1>
          {step === 'details' ? (
            <Button variant="link" onClick={handleShare} disabled={isSubmitting}>Share</Button>
          ) : step !== 'sharing' ? (
            <Button variant="link" onClick={handleNext}>Next</Button>
          ) : <div className="w-14" />}
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="relative w-full aspect-square bg-black flex items-center justify-center">
             <AnimatePresence mode="wait">
                  <motion.div
                      key={step}
                      initial={{ opacity: 0, x: step === 'details' ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: step === 'edit' ? 50 : -50 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full h-full"
                  >
                      {steps[step]}
                  </motion.div>
              </AnimatePresence>
          </div>
          {step === 'edit' && <EditControls />}
           {step === 'crop' && (
              <div className="h-24 flex-shrink-0 text-center flex items-center justify-center">
                  <p>Crop controls here</p>
              </div>
            )}
        </main>
      </div>
  );
}
