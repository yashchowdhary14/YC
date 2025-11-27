
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FinalizedCreateData } from '../types';
import { Separator } from '@/components/ui/separator';

const categories = ["Tech", "Food", "Science", "Travel", "Art", "Fitness", "Sports"];

interface VideoSettingsProps {
  settings: FinalizedCreateData['settings'];
  setSettings: (settings: FinalizedCreateData['settings']) => void;
}

export default function VideoSettings({ settings, setSettings }: VideoSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="font-semibold">Visibility</Label>
        <RadioGroup
          defaultValue="public"
          className="mt-2"
          value={settings.visibility}
          onValueChange={(value: "public" | "unlisted" | "private") => setSettings({ ...settings, visibility: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unlisted" id="unlisted" />
            <Label htmlFor="unlisted">Unlisted</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Private</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label htmlFor="category" className="font-semibold">Category</Label>
        <Select onValueChange={(value) => setSettings({ ...settings, category: value })}>
          <SelectTrigger id="category" className="w-full mt-2">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="p-2 -mx-2 hover:no-underline hover:bg-accent rounded-md">
            Advanced settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="disable-comments" className="pr-4">Turn off commenting</Label>
                <Switch
                  id="disable-comments"
                  checked={settings.disableComments}
                  onCheckedChange={(checked) => setSettings({ ...settings, disableComments: checked })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
