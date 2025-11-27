'use client';

import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import UploadManager from "./UploadManager";
import PublishSuccessScreen from "./PublishSuccessScreen";
import { useLocalFeedStore } from "@/store/localFeedStore";


type CreateModalProps = {
  open: boolean;
  onClose: () => void;
};

type Step = "select-type" | "media-picker" | "media-preview" | "media-details" | "publish" | "success";


export function CreateModal({ open, onClose }: CreateModalProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  
  const [step, setStep] = useState<Step>("select-type");
  const [mode, setMode] = useState<CreateMode | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [finalizedData, setFinalizedData] = useState<FinalizedCreateData | null>(null);
  const [uploadResult, setUploadResult] = useState<SimulatedUploadResult | null>(null);

  const addItemToFeed = useLocalFeedStore(s => s.addItem);
  
  const handleSelect = (selectedMode: CreateMode) => {
    if (selectedMode === 'live') {
        router.push('/studio/broadcast');
        onClose();
        return;
    }
    setMode(selectedMode);
    setStep("media-picker");
  };

  const handleMediaSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setStep("media-preview");
  };
  
  const handlePreviewConfirmed = (validatedFiles: File[]) => {
    setFiles(validatedFiles);
    setStep("media-details");
  }

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
    } else if (step === 'media-picker') {
        setStep('select-type');
    }
  }

  const resetFlow = () => {
    onClose();
    // Delay reset to allow animations to finish
    setTimeout(() => {
        setStep('select-type');
        setMode(null);
        setFiles([]);
        setFinalizedData(null);
        setUploadResult(null);
    }, 300);
  }

  const renderStep = () => {
    switch (step) {
        case "select-type":
            return <CreateChoiceScreen onSelect={handleSelect} />;
        case "media-picker":
            if (!mode || mode === 'live') return null;
            return <MediaPicker mode={mode} onMediaSelected={handleMediaSelected} onBack={handleBack} />;
        case "media-preview":
            if (!mode || mode === 'live' || files.length === 0) return null;
            return <MediaPreview mode={mode} files={files} onBack={handleBack} onConfirm={handlePreviewConfirmed} />;
        case "media-details":
             if (!mode || mode === 'live' || files.length === 0) return null;
             return <MediaDetailsForm mode={mode} files={files} onBack={handleBack} onSubmit={handleSubmitDetails} />
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
  
  const stepTitles: Partial<Record<Step, string>> = {
    'select-type': 'Create',
    'media-picker': mode ? `New ${mode.charAt(0).toUpperCase() + mode.slice(1)}` : 'Select Media',
    'media-preview': 'Preview',
    'media-details': 'Add Details',
    'publish': 'Publishing...',
    'success': 'Published!'
  };

  const title = stepTitles[step] || 'Create';
  
  const showHeader = step !== 'publish' && step !== 'success';

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

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={resetFlow}>
        <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-2xl p-0 gap-0">
          <div className="w-full pt-3 pb-2 flex justify-center sticky top-0 bg-background z-10">
            <div className="w-8 h-1 bg-muted rounded-full" />
          </div>
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
      <DialogContent className={cn("sm:max-w-xl md:max-w-2xl lg:max-w-4xl h-[80vh] flex flex-col p-0 gap-0", (step === 'publish' || step === 'success') && "md:max-w-xl")}>
        {showHeader && renderHeader()}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
