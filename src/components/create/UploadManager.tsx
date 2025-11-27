'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader, Cloud, Settings, Film } from 'lucide-react';
import type { FinalizedCreateData, CreateMode, SimulatedUploadResult } from './types';
import { Progress } from '../ui/progress';
<<<<<<< HEAD
import { useUser, useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
=======
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

type UploadManagerProps = {
  data: FinalizedCreateData;
  onComplete: (result: SimulatedUploadResult) => void;
};

enum UploadStage {
  PROCESSING,
  OPTIMIZING,
  UPLOADING,
  FINALIZING,
  COMPLETE,
  ERROR,
}

<<<<<<< HEAD
const getStageDetails = (mode: CreateMode, fileSize: number): Record<UploadStage, { text: string; duration: number; icon: React.ReactNode }> => {
  const isVideo = mode === 'video' || mode === 'reel';
  const isLargeFile = fileSize > 50 * 1024 * 1024; // 50MB

  return {
    [UploadStage.PROCESSING]: {
      text: isVideo ? "Processing video..." : "Processing media...",
      duration: isVideo ? (isLargeFile ? 2500 : 1500) : 1200,
      icon: <Settings className="h-5 w-5" />
    },
    [UploadStage.OPTIMIZING]: {
      text: isVideo ? "Transcoding video..." : "Optimizing quality...",
      duration: isVideo ? (isLargeFile ? 3000 : 2000) : 800,
      icon: <Film className="h-5 w-5" />
    },
    [UploadStage.UPLOADING]: {
      text: "Uploading to cloud...",
      duration: isLargeFile ? 4000 : 2000,
      icon: <Cloud className="h-5 w-5" />
    },
    [UploadStage.FINALIZING]: {
      text: "Finalizing...",
      duration: 1000,
      icon: <Loader className="h-5 w-5 animate-spin" />
    },
    [UploadStage.COMPLETE]: {
      text: "Upload Complete!",
      duration: 0,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
    [UploadStage.ERROR]: {
      text: "Upload Failed",
      duration: 0,
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />
    },
  };
=======
const stageDetails: Record<UploadStage, { text: string; duration: number; icon: React.ReactNode }> = {
  [UploadStage.PROCESSING]: { text: "Processing media...", duration: 1200, icon: <Settings className="h-5 w-5" /> },
  [UploadStage.OPTIMIZING]: { text: "Optimizing quality...", duration: 800, icon: <Film className="h-5 w-5" /> },
  [UploadStage.UPLOADING]: { text: "Uploading to cloud...", duration: 2000, icon: <Cloud className="h-5 w-5" /> },
  [UploadStage.FINALIZING]: { text: "Finalizing...", duration: 1000, icon: <Loader className="h-5 w-5 animate-spin" /> },
  [UploadStage.COMPLETE]: { text: "Upload Complete!", duration: 0, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
  [UploadStage.ERROR]: { text: "Upload Failed", duration: 0, icon: <AlertTriangle className="h-5 w-5 text-destructive" /> },
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
};


export default function UploadManager({ data, onComplete }: UploadManagerProps) {
  const [stage, setStage] = useState<UploadStage>(UploadStage.PROCESSING);
  const [progress, setProgress] = useState(0);

  const previewUrl = useMemo(() => {
    if (data.files.length > 0) {
      return URL.createObjectURL(data.files[0]);
    }
    return '';
  }, [data.files]);

<<<<<<< HEAD
  const totalFileSize = useMemo(() => {
    return data.files.reduce((sum, file) => sum + file.size, 0);
  }, [data.files]);

  const stageDetails = useMemo(() => getStageDetails(data.mode, totalFileSize), [data.mode, totalFileSize]);

  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();

  useEffect(() => {
    let isMounted = true;

    const performUpload = async () => {
      if (!user || !firestore || !storage) {
        setStage(UploadStage.ERROR);
        return;
      }

      try {
        setStage(UploadStage.PROCESSING);
        await new Promise(r => setTimeout(r, 500)); // Simulate processing

        setStage(UploadStage.OPTIMIZING);
        await new Promise(r => setTimeout(r, 500)); // Simulate optimizing

        setStage(UploadStage.UPLOADING);

        const uploadedUrls: string[] = [];
        const totalFiles = data.files.length;

        for (let i = 0; i < totalFiles; i++) {
          const file = data.files[i];
          const storageRef = ref(storage, `users/${user.uid}/posts/${Date.now()}_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const totalProgress = ((i * 100) + fileProgress) / totalFiles;
                if (isMounted) setProgress(totalProgress);
              },
              (error) => reject(error),
              async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedUrls.push(downloadUrl);
                resolve();
              }
            );
          });
        }

        setStage(UploadStage.FINALIZING);

        const postRef = doc(collection(firestore, 'posts'));
        const newPost: any = {
          id: postRef.id,
          uploaderId: user.uid,
          type: data.mode === 'video' ? 'video' : (data.mode === 'reel' ? 'reel' : 'photo'),
          mediaUrls: uploadedUrls,
          thumbnailUrl: uploadedUrls[0], // Simplified
          caption: data.caption,
          tags: data.tags,
          taggedUsers: data.taggedUsers,
          accessibility: data.accessibility,
          location: data.location,
          settings: data.settings,
          likes: [], // Initialize as array
          commentsCount: 0,
          views: 0,
          createdAt: serverTimestamp(),
        };

        await setDoc(postRef, newPost);

        // Also add to user's posts subcollection or update count (optional, but good practice)
        // For now, we rely on the global posts collection query with uploaderId filter

        if (isMounted) {
          setStage(UploadStage.COMPLETE);
          setTimeout(() => {
            const result: SimulatedUploadResult = {
              id: postRef.id,
              mediaUrls: uploadedUrls,
              thumbnailUrl: uploadedUrls[0],
              mode: data.mode,
              metadata: data,
            };
            onComplete(result);
          }, 1000);
        }

      } catch (error) {
        console.error("Upload failed:", error);
        if (isMounted) setStage(UploadStage.ERROR);
      }
    };

    performUpload();

    return () => { isMounted = false; };
  }, [data, onComplete, user, firestore, storage]);
=======
  useEffect(() => {
    let stageTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runStage = (currentStage: UploadStage) => {
        if (currentStage >= UploadStage.COMPLETE) return;

        const details = stageDetails[currentStage];

        if (currentStage === UploadStage.UPLOADING) {
            let currentProgress = 0;
            const steps = details.duration / 50;
            progressInterval = setInterval(() => {
                currentProgress += 100 / steps;
                setProgress(Math.min(currentProgress, 100));
                if (currentProgress >= 100) {
                    clearInterval(progressInterval);
                    setStage(UploadStage.FINALIZING);
                    runStage(UploadStage.FINALIZING);
                }
            }, 50);
        } else {
             stageTimeout = setTimeout(() => {
                const nextStage = currentStage + 1;
                setStage(nextStage);
                runStage(nextStage);
            }, details.duration);
        }
    };
    
    runStage(UploadStage.PROCESSING);

    return () => {
        clearTimeout(stageTimeout);
        clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (stage === UploadStage.COMPLETE) {
      // Simulate final result after a short delay to show "Complete" message
      setTimeout(() => {
        const result: SimulatedUploadResult = {
          id: crypto.randomUUID(),
          mediaUrls: data.files.map(f => URL.createObjectURL(f)),
          thumbnailUrl: previewUrl,
          mode: data.mode,
          metadata: data,
        };
        onComplete(result);
      }, 1500);
    }
  }, [stage, data, onComplete, previewUrl]);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background text-foreground p-4 text-center">
      <div className="w-full max-w-sm">
        <motion.div
<<<<<<< HEAD
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
          className="relative aspect-square w-full rounded-lg overflow-hidden mb-6 shadow-lg"
        >
          {previewUrl && <Image src={previewUrl} alt="Upload preview" fill className="object-cover" />}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-2 right-2">
            <span className="text-xs font-bold uppercase bg-black/50 text-white px-2 py-1 rounded-md">{data.mode}</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              {stageDetails[stage].icon}
              <span>{stageDetails[stage].text}</span>
            </h2>
          </motion.div>
        </AnimatePresence>

        <div className="w-full mt-4">
          <Progress value={stage === UploadStage.UPLOADING ? progress : (stage > UploadStage.UPLOADING ? 100 : 0)} className="h-2" />
          {stage === UploadStage.UPLOADING && (
            <p className="text-sm font-semibold text-muted-foreground mt-2">{Math.round(progress)}%</p>
          )}
        </div>

=======
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
            className="relative aspect-square w-full rounded-lg overflow-hidden mb-6 shadow-lg"
        >
          {previewUrl && <Image src={previewUrl} alt="Upload preview" fill className="object-cover" />}
           <div className="absolute inset-0 bg-black/30" />
           <div className="absolute top-2 right-2">
               <span className="text-xs font-bold uppercase bg-black/50 text-white px-2 py-1 rounded-md">{data.mode}</span>
           </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
             <motion.div
                key={stage}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    {stageDetails[stage].icon}
                    <span>{stageDetails[stage].text}</span>
                </h2>
            </motion.div>
        </AnimatePresence>

        <div className="w-full mt-4">
            <Progress value={stage === UploadStage.UPLOADING ? progress : (stage > UploadStage.UPLOADING ? 100 : 0)} className="h-2" />
             {stage === UploadStage.UPLOADING && (
                <p className="text-sm font-semibold text-muted-foreground mt-2">{Math.round(progress)}%</p>
             )}
        </div>
        
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
      </div>
    </div>
  );
}
