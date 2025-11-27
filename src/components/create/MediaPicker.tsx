
'use client';

import { useState, useRef, ChangeEvent, useMemo } from 'react';
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
    file: File;
    previewUrl: string;
};

export default function MediaPicker({ mode, onMediaSelected, onBack }: MediaPickerProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = useMemo(() => {
    switch (mode) {
      case 'post':
        return { accept: 'image/*,video/*', multiple: true, limit: 10 };
      case 'reel':
        return { accept: 'video/*', multiple: false };
      case 'video':
        return { accept: 'video/*', multiple: false };
      case 'story':
        return { accept: 'image/*,video/*', multiple: false };
      default:
        return { accept: '*', multiple: false };
    }
  }, [mode]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let newFiles: SelectedFile[] = Array.from(files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
    }));
    
    if (config.multiple) {
        // Multi-select logic for posts
        setSelectedFiles(prev => {
            const combined = [...prev, ...newFiles];
            if (config.limit && combined.length > config.limit) {
                // TODO: Add toast notification
                console.warn(`Cannot select more than ${config.limit} files.`);
                return prev;
            }
            return combined;
        });
    } else {
        // Single-select logic
        setSelectedFiles(newFiles.slice(0, 1));
    }
  };

  const toggleFileSelection = (file: SelectedFile) => {
    setSelectedFiles(prev => {
        const isSelected = prev.some(sf => sf.previewUrl === file.previewUrl);
        if (isSelected) {
            return prev.filter(sf => sf.previewUrl !== file.previewUrl);
        } else {
            if (config.multiple) {
                if (config.limit && prev.length >= config.limit) {
                    console.warn(`Cannot select more than ${config.limit} files.`);
                    return prev;
                }
                return [...prev, file];
            } else {
                return [file];
            }
        }
    });
  }

  const handleContinue = () => {
    if (selectedFiles.length > 0) {
      onMediaSelected(selectedFiles.map(sf => sf.file));
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
        <header className="flex items-center justify-between p-2 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft />
          </Button>
          <h2 className="font-semibold text-lg">Select media</h2>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-4" style={{ display: selectedFiles.length > 0 ? 'none' : 'flex' }}>
            <p className="text-xl font-semibold mb-2">Select files to get started</p>
            <p className="text-muted-foreground mb-4">You can select photos and videos from your device.</p>
            <Button onClick={() => fileInputRef.current?.click()}>
                Select from device
            </Button>
        </div>

        {selectedFiles.length > 0 && (
            <ScrollArea className="flex-1 p-2">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                    {selectedFiles.map((sf) => (
                        <div key={sf.previewUrl} className="relative aspect-square cursor-pointer" onClick={() => toggleFileSelection(sf)}>
                            <Image src={sf.previewUrl} alt={sf.file.name} fill className="object-cover rounded-md" />
                            <div className={cn(
                                "absolute top-2 right-2 h-5 w-5 rounded-full border-2 bg-black/30 transition-all",
                                selectedFiles.some(f => f.previewUrl === sf.previewUrl) ? "bg-primary border-primary" : "border-white"
                            )}>
                                {selectedFiles.some(f => f.previewUrl === sf.previewUrl) && <CheckCircle2 className="h-full w-full text-white" />}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        )}

        {selectedFiles.length > 0 && (
            <div className="p-4 border-t">
                <Button className="w-full" onClick={handleContinue}>Continue</Button>
            </div>
        )}
      
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
