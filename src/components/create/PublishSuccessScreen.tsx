'use client';

import { motion } from 'framer-motion';
import { Check, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { SimulatedUploadResult } from './types';

type PublishSuccessScreenProps = {
  result: SimulatedUploadResult;
  onClose: () => void;
};

const getTitleText = (mode: SimulatedUploadResult['mode']) => {
    switch (mode) {
        case 'post': return 'Your post is published!';
        case 'reel': return 'Your reel is now live!';
        case 'video': return 'Your video has been published!';
        case 'story': return 'Your story is now visible!';
        default: return 'Published!';
    }
}

const getSubtitleText = (mode: SimulatedUploadResult['mode']) => {
    switch (mode) {
        case 'post': return 'Your post is now visible on your profile.';
        case 'reel': return 'Your reel is now visible to others.';
        case 'video': return 'Find it in the "Videos" tab.';
        case 'story': return 'It will be visible for the next 24 hours.';
        default: return 'Your content is live.';
    }
}

const getActionLink = (result: SimulatedUploadResult) => {
    switch (result.mode) {
        case 'post': return `/p/${result.id}`;
        case 'reel': return `/reels?reelId=${result.id}`;
        case 'video': return `/watch/${result.id}`;
        case 'story': return `/stories/${result.metadata.mode}`; // Simplified link
        default: return '/';
    }
}

export default function PublishSuccessScreen({ result, onClose }: PublishSuccessScreenProps) {
    const router = useRouter();
    
    const handleView = () => {
        router.push(getActionLink(result));
        onClose();
    }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background text-foreground p-8 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center mb-6"
      >
        <Check className="w-12 h-12 text-green-500" />
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold mb-2"
      >
        {getTitleText(result.mode)}
      </motion.h2>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground mb-8"
      >
        {getSubtitleText(result.mode)}
      </motion.p>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative w-24 h-24 rounded-md overflow-hidden"
      >
        <Image src={result.thumbnailUrl} alt="Published content" fill className="object-cover" />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs"
      >
        <Button onClick={handleView} className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View it
        </Button>
        <Button variant="secondary" onClick={onClose} className="w-full">
            Close
        </Button>
      </motion.div>
    </div>
  );
}
