
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

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
};

type Step = "select-type" | "media-picker" | "media-preview" | "editor" | "publish";


export function CreateModal({ open, onClose }: CreateModalProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  
  const [step, setStep] = useState<Step>("select-type");
  const [mode, setMode] = useState<CreateMode | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
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
    console.log("Preview validated, proceeding to next step with:", validatedFiles);
    // For now, just close the modal. In A5, this will go to the caption/publish step.
    onClose();
  }

  const handleBack = () => {
    if (step === 'media-preview') {
      setStep('media-picker');
    } else if (step === 'media-picker') {
        setStep('select-type');
    }
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
        default:
            return <CreateChoiceScreen onSelect={handleSelect} />;
    }
  }
  
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

  const title = {
    'select-type': 'Create',
    'media-picker': mode === 'post' ? 'New Post' : mode === 'reel' ? 'New Reel' : mode === 'video' ? 'Upload Video' : 'Create Story',
    'media-preview': 'Preview',
  }[step] || 'Create';

  const resetFlow = () => {
    onClose();
    // Delay reset to allow animations to finish
    setTimeout(() => {
        setStep('select-type');
        setMode(null);
        setFiles([]);
    }, 300);
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={resetFlow}>
        <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl p-0">
          <div className="w-full pt-3 pb-2 flex justify-center">
            <div className="w-8 h-1 bg-muted rounded-full" />
          </div>
          <DialogHeader className="text-center pb-2 border-b">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="p-0 flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={resetFlow}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4">
          <DialogTitle className="text-center text-lg font-semibold border-b pb-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
