
'use client';

import { useState, useRef, ChangeEvent, useMemo, useEffect } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { CreateMode } from './CreateChoiceScreen';
import Image from 'next/image';

type MediaPickerProps = {
  mode: Exclude<CreateMode, 'live'>;
  onMediaSelected: (files: File[]) => void;
  onBack: () => void;
};

type SelectedFile = {
<<<<<<< HEAD
  file: File;
  previewUrl: string;
=======
    file: File;
    previewUrl: string;
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
};

export default function MediaPicker({ mode, onMediaSelected, onBack }: MediaPickerProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = useMemo(() => {
    switch (mode) {
      case 'post':
        return { accept: 'image/*,video/*', multiple: true, limit: 10 };
      case 'reel':
<<<<<<< HEAD
=======
        return { accept: 'video/*', multiple: false };
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
      case 'video':
        return { accept: 'video/*', multiple: false };
      case 'story':
        return { accept: 'image/*,video/*', multiple: false };
      default:
        return { accept: '*', multiple: false };
    }
  }, [mode]);

  useEffect(() => {
<<<<<<< HEAD
    // Trigger file picker automatically if no files are selected
    if (selectedFiles.length === 0) {
      fileInputRef.current?.click();
    }
=======
      // Trigger file picker automatically if no files are selected
      if (selectedFiles.length === 0) {
          fileInputRef.current?.click();
      }
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
<<<<<<< HEAD
      if (selectedFiles.length === 0) onBack(); // Go back if user cancels the initial file selection
      return;
    }

    let newFiles: SelectedFile[] = Array.from(files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

=======
        if(selectedFiles.length === 0) onBack(); // Go back if user cancels the initial file selection
        return;
    }

    let newFiles: SelectedFile[] = Array.from(files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
    }));
    
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    // For single-file modes, just pass the file through immediately.
    if (!config.multiple) {
      onMediaSelected([newFiles[0].file]);
      return;
    }

    // For multi-select mode (posts)
    onMediaSelected(newFiles.map(f => f.file));

  };

  const handleContinue = () => {
    if (selectedFiles.length > 0) {
      onMediaSelected(selectedFiles.map(sf => sf.file));
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
<<<<<<< HEAD
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl font-semibold mb-2">Select files to get started</p>
        <p className="text-muted-foreground mb-4">You can select photos and videos from your device.</p>
        <Button onClick={() => fileInputRef.current?.click()}>
          Select from device
        </Button>
      </div>

=======
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xl font-semibold mb-2">Select files to get started</p>
            <p className="text-muted-foreground mb-4">You can select photos and videos from your device.</p>
            <Button onClick={() => fileInputRef.current?.click()}>
                Select from device
            </Button>
        </div>
      
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={config.accept}
        multiple={config.multiple}
        onChange={handleFileChange}
      />
    </div>
  );
}
