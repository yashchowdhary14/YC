
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  altTexts: string[];
  setAltTexts: (altTexts: string[]) => void;
}

export default function AccessibilityModal({ isOpen, onClose, files, altTexts, setAltTexts }: AccessibilityModalProps) {
    
    const handleTextChange = (index: number, value: string) => {
        const newAltTexts = [...altTexts];
        newAltTexts[index] = value;
        setAltTexts(newAltTexts);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex flex-col h-[70vh]">
                <DialogHeader>
                    <DialogTitle>Accessibility</DialogTitle>
                     <p className="text-sm text-muted-foreground pt-2">Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can write your own.</p>
                </DialogHeader>
                <ScrollArea className="flex-1 -mx-6">
                    <div className="px-6 space-y-4">
                        {files.map((file, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                                    <Image src={URL.createObjectURL(file)} alt={`Media ${index+1}`} fill className="object-cover" />
                                </div>
                                <Textarea 
                                    placeholder={`Write alt text for media ${index + 1}...`}
                                    value={altTexts[index]}
                                    onChange={(e) => handleTextChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
