
'use client';

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CreateChoiceScreen, { CreateMode } from "./CreateChoiceScreen";
import MediaPicker from "./MediaPicker";
import MediaPreview from "./MediaPreview";
import MediaDetailsForm from "./MediaDetailsForm";
import type { FinalizedCreateData, SimulatedUploadResult } from "./types";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import UploadManager from "./UploadManager";
import PublishSuccessScreen from "./PublishSuccessScreen";
import { useLocalFeedStore } from "@/store/localFeedStore";
import CreateStoryPage from "@/app/create/story/page";
import { useCreateStore } from "@/lib/create-store";


type CreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateModal({ open, onClose }: CreateModalProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  
  const {
    step,
    setStep,
    mode,
    setMode,
    media,
    addMedia,
    setFinalizedData,
    finalizedData,
    reset: resetStore,
  } = useCreateStore();
  
  const [uploadResult, setUploadResult] = useState<SimulatedUploadResult | null>(null);

  const addItemToFeed = useLocalFeedStore(s => s.addItem);
  
  useEffect(() => {
    // If the modal is closed, reset the state
    if (!open) {
      // Delay reset to allow animations to finish
      setTimeout(() => {
        setStep('select-type');
        setMode(null);
        setFinalizedData(null);
        setUploadResult(null);
        // Also reset media files in the store
        resetStore();
      }, 300);
    }
  }, [open, setStep, setMode, setFinalizedData, resetStore]);


  const handleSelect = (selectedMode: CreateMode) => {
    setMode(selectedMode);
    if (selectedMode === 'live') {
        router.push('/studio/broadcast');
        onClose();
        return;
    }
    if (selectedMode === 'story') {
        setStep('story-editor');
    } else {
        setStep("media-picker");
    }
  };

  const handleMediaSelected = async (selectedFiles: File[]) => {
    await addMedia(selectedFiles);
    setStep("media-preview");
  };
  
  const handlePreviewConfirmed = (validatedFiles: File[]) => {
    // Media is already in the store, just move to next step
    setStep("media-details");
  }

  const handleStoryEditingComplete = (renderedFile: File) => {
    setMode('story');
    addMedia([renderedFile]);
    setStep('media-details');
  };

  const handleSubmitDetails = (payload: FinalizedCreateData) => {
    setFinalizedData(payload);
    setStep("publish");
  }
  
  const handleUploadComplete = (result: SimulatedUploadResult) => {
      setUploadResult(result);
      addItemToFeed({
        ...result,
        createdAt: Date.now(),
      });
      setStep("success");
  }

  const handleBack = () => {
    if (step === 'media-details') {
      setStep('media-preview');
    } else if (step === 'media-preview') {
      setStep('media-picker');
    } else if (step === 'media-picker' || step === 'story-editor') {
        setStep('select-type');
    }
  }

  const resetFlow = () => {
    onClose();
  }

  const renderStep = () => {
    switch (step) {
        case "select-type":
            return <CreateChoiceScreen onSelect={handleSelect} />;
        case "media-picker":
            if (!mode || mode === 'live') return null;
            return <MediaPicker mode={mode} onMediaSelected={handleMediaSelected} onBack={handleBack} />;
        case "story-editor":
            return <CreateStoryPage onStoryReady={handleStoryEditingComplete} onExit={handleBack} />;
        case "media-preview":
            if (!mode || mode === 'live' || media.length === 0) return null;
            return <MediaPreview onBack={handleBack} onConfirm={handlePreviewConfirmed} />;
        case "media-details":
             if (!mode || mode === 'live' || media.length === 0) return null;
             return <MediaDetailsForm mode={mode} files={media.map(m => m.file)} onBack={handleBack} onSubmit={handleSubmitDetails} />
        case "publish":
            if (!finalizedData) return null;
            return <UploadManager data={finalizedData} onComplete={handleUploadComplete} />;
        case "success":
            if (!uploadResult) return null;
            return <PublishSuccessScreen result={uploadResult} onClose={resetFlow} />;
        default:
            return <CreateChoiceScreen onSelect={handleSelect} />;
    }
  }
  
  const stepTitles: Partial<Record<typeof step, string>> = {
    'select-type': 'Create',
    'media-picker': mode ? `New ${mode.charAt(0).toUpperCase() + mode.slice(1)}` : 'Select Media',
    'story-editor': 'New Story',
    'media-preview': 'Preview',
    'media-details': 'Add Details',
    'publish': 'Publishing...',
    'success': 'Published!'
  };

  const title = stepTitles[step] || 'Create';
  
  const showHeader = step !== 'publish' && step !== 'success' && step !== 'story-editor';

  const renderHeader = () => (
    <DialogHeader className="p-0 sm:p-4 text-center border-b sm:border-none relative">
        <DialogTitle className={cn("text-lg font-semibold", isMobile && "p-4 border-b")}>{title}</DialogTitle>
        {step !== 'select-type' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2" 
              onClick={handleBack}
            >
              <ArrowLeft />
            </Button>
        )}
    </DialogHeader>
  );

  const renderContent = () => (
     <div className="h-full">
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 'select-type' ? 0 : 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-full"
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
     </div>
  );

  const dialogContentClasses = cn(
    "sm:max-w-xl md:max-w-2xl lg:max-w-4xl h-[80vh] flex flex-col p-0 gap-0",
    (step === 'publish' || step === 'success') && "md:max-w-xl",
    step === 'story-editor' && 'h-[95vh] w-screen max-w-full sm:max-w-md sm:h-[90vh]'
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={resetFlow}>
        <SheetContent 
            side="bottom" 
            className={cn(
                "h-[90vh] flex flex-col rounded-t-2xl p-0 gap-0",
                step === 'story-editor' && 'h-screen w-screen max-h-screen rounded-none'
            )}
        >
          {step !== 'story-editor' && (
            <div className="w-full pt-3 pb-2 flex justify-center sticky top-0 bg-background z-10">
              <div className="w-8 h-1 bg-muted rounded-full" />
            </div>
          )}
          {showHeader && renderHeader()}
          <div className="p-0 flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={resetFlow}>
      <DialogContent className={dialogContentClasses}>
        {showHeader && renderHeader()}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
