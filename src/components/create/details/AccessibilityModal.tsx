<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======

'use client';

>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
<<<<<<< HEAD
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

interface AccessibilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    files: File[];
    altTexts: string[];
    setAltTexts: (altTexts: string[]) => void;
}

export default function AccessibilityModal({ isOpen, onClose, files, altTexts, setAltTexts }: AccessibilityModalProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        if (!api) return;

        const handleSelect = () => {
            setActiveSlideIndex(api.selectedScrollSnap());
        };

        api.on("select", handleSelect);
        return () => {
            api.off("select", handleSelect);
        };
    }, [api]);

    const handleTextChange = (value: string) => {
        const newAltTexts = [...altTexts];
        newAltTexts[activeSlideIndex] = value;
=======

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
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
        setAltTexts(newAltTexts);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
<<<<<<< HEAD
            <DialogContent className="flex flex-col h-[80vh] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Accessibility</DialogTitle>
                    <p className="text-sm text-muted-foreground pt-2 text-center">Alt text describes your photos for people with visual impairments.</p>
                </DialogHeader>

                {/* Carousel for Media Selection */}
                {files.length > 0 && (
                    <div className="w-full flex justify-center py-2 bg-black/5 rounded-md mb-2">
                        <Carousel setApi={setApi} className="w-48 aspect-square">
                            <CarouselContent>
                                {files.map((file, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative w-full aspect-square rounded-md overflow-hidden">
                                            {file.type.startsWith('video') ? (
                                                <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                            ) : (
                                                <Image src={URL.createObjectURL(file)} alt={`Media ${index + 1}`} fill className="object-cover" />
                                            )}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {files.length > 1 && (
                                <>
                                    <CarouselPrevious className="-left-4" />
                                    <CarouselNext className="-right-4" />
                                </>
                            )}
                        </Carousel>
                    </div>
                )}

                <div className="px-1 py-2 text-xs text-muted-foreground text-center">
                    Editing alt text for item {activeSlideIndex + 1} of {files.length}
                </div>

                <div className="flex-1 p-1">
                    <Textarea
                        placeholder={`Write alt text for this photo...`}
                        value={altTexts[activeSlideIndex] || ''}
                        onChange={(e) => handleTextChange(e.target.value)}
                        className="h-full resize-none"
                    />
                </div>
=======
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
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
            </DialogContent>
        </Dialog>
    );
}
