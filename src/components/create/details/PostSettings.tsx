
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { FinalizedCreateData } from "../types"

interface PostSettingsProps {
    settings: FinalizedCreateData['settings'];
    setSettings: (settings: FinalizedCreateData['settings']) => void;
}

export default function PostSettings({ settings, setSettings }: PostSettingsProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced" className="border-none">
        <AccordionTrigger className="p-2 -mx-2 hover:no-underline hover:bg-accent rounded-md">Advanced settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hide-likes" className="pr-4">Hide like and view counts</Label>
              <Switch
                id="hide-likes"
                checked={settings.hideLikes}
                onCheckedChange={(checked) => setSettings({ ...settings, hideLikes: checked })}
              />
            </div>
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
  );
}
