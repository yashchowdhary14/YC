
'use client';

import { usePostCreationStore, useActiveMedia } from '@/lib/post-creation-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const filters = [
    { name: 'Normal', value: 'none' },
    { name: 'Clarendon', value: 'contrast(1.2) saturate(1.35)'},
    { name: 'Gingham', value: 'brightness(1.05) hue-rotate(-10deg)'},
    { name: 'Moon', value: 'grayscale(1) contrast(1.1) brightness(1.1)'},
    { name: 'Lark', value: 'contrast(.9) brightness(1.2)'},
    { name: 'Reyes', value: 'sepia(.22) brightness(1.1) contrast(.85) saturate(.75)'},
];

const FilterTab = () => {
    const activeMedia = useActiveMedia();
    const { updateMedia } = usePostCreationStore();

    if (!activeMedia) return null;
    
    return (
        <div className="grid grid-cols-4 gap-2 px-2">
            {filters.map(filter => (
                <div key={filter.name} className="text-center" onClick={() => updateMedia(activeMedia.id, { filter: filter.value })}>
                    <div className="aspect-square bg-muted rounded-md" style={{
                        backgroundImage: `url(${activeMedia.previewUrl})`,
                        backgroundSize: 'cover',
                        filter: filter.value
                    }}></div>
                    <Label className="text-xs mt-1">{filter.name}</Label>
                </div>
            ))}
        </div>
    )
}

const AdjustTab = () => {
    const activeMedia = useActiveMedia();
    const { updateMedia } = usePostCreationStore();

    if (!activeMedia) return null;
    
    return (
        <div className="p-4 space-y-6">
            <div className="space-y-2">
                <Label>Brightness</Label>
                <Slider 
                    defaultValue={[activeMedia.brightness]} 
                    max={200} 
                    min={0}
                    step={1} 
                    onValueChange={([value]) => updateMedia(activeMedia.id, { brightness: value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Contrast</Label>
                <Slider 
                    defaultValue={[activeMedia.contrast]} 
                    max={200} 
                    min={0}
                    step={1} 
                    onValueChange={([value]) => updateMedia(activeMedia.id, { contrast: value })}
                />
            </div>
        </div>
    )
}


const EditControls = () => {
    return (
        <div className="bg-black text-white h-48 flex-shrink-0">
            <Tabs defaultValue="filter" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-black border-t border-b border-gray-800 rounded-none">
                    <TabsTrigger value="filter" className="text-white/70 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-white">Filters</TabsTrigger>
                    <TabsTrigger value="adjust" className="text-white/70 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-white">Adjust</TabsTrigger>
                </TabsList>
                <TabsContent value="filter" className="flex-1 overflow-y-auto mt-0">
                    <FilterTab />
                </TabsContent>
                <TabsContent value="adjust" className="flex-1 overflow-y-auto mt-0">
                    <AdjustTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EditControls;

