
'use client';

import { usePostCreationStore, useActiveMedia } from '@/lib/post-creation-store';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Wand2, Loader2, Tag, MapPin, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

interface DetailsFormProps {
    onGenerateCaption: () => void;
}

const DetailsForm = ({ onGenerateCaption }: DetailsFormProps) => {
    const { 
        caption, 
        setCaption, 
        isGeneratingCaption,
        hideLikes,
        setHideLikes,
        disableComments,
        setDisableComments
    } = usePostCreationStore();
    const activeMedia = useActiveMedia();

    if (!activeMedia) return null;

    return (
        <div className="w-full h-full flex flex-col text-white bg-black">
            <div className="p-4 flex gap-4 border-b border-gray-800">
                <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image src={activeMedia.previewUrl} alt="preview" fill className="object-cover" />
                </div>
                <div className="flex-1 relative">
                    <Textarea 
                        placeholder="Write a caption..." 
                        className="bg-transparent border-none text-base h-full resize-none p-0 focus-visible:ring-0"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                     <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="absolute bottom-0 right-0 bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white"
                        onClick={onGenerateCaption}
                        disabled={isGeneratingCaption}
                    >
                        {isGeneratingCaption ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        <span className="ml-2 hidden sm:inline">AI</span>
                    </Button>
                </div>
            </div>
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Tag />
                    <span>Tag people</span>
                </div>
                <ChevronRight className="text-gray-500" />
            </div>
             <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <MapPin />
                    <span>Add location</span>
                </div>
                <ChevronRight className="text-gray-500" />
            </div>

            <Accordion type="single" collapsible className="w-full px-4">
              <AccordionItem value="item-1" className="border-b-gray-800">
                <AccordionTrigger className="hover:no-underline">Advanced settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="hide-likes">Hide like and view counts on this post</Label>
                        <Switch id="hide-likes" checked={hideLikes} onCheckedChange={setHideLikes} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="disable-comments">Turn off commenting</Label>
                        <Switch id="disable-comments" checked={disableComments} onCheckedChange={setDisableComments} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
};

export default DetailsForm;

