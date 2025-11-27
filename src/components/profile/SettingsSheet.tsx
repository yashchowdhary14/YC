
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { AnimatePresence, motion } from 'framer-motion';
import SettingsRouter from './settings/SettingsRouter';
import type { SettingsView } from './settings/types';


interface SettingsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}


export default function SettingsSheet({ isOpen, onOpenChange }: SettingsSheetProps) {
  const [view, setView] = useState<SettingsView>('main');
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      // Reset view to main when closing
      if (!open) {
        setTimeout(() => setView('main'), 300); // Delay to allow exit animation
      }
    }}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:max-w-md p-0 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevents auto-focus on first element
      >
        {/* The title is visually hidden but accessible to screen readers */}
        <SheetHeader className="sr-only">
          <SheetTitle>Settings and Activity</SheetTitle>
          <SheetDescription>
            Manage your account settings, privacy, and activity.
          </SheetDescription>
        </SheetHeader>
        <div className="relative h-full overflow-hidden">
          <AnimatePresence initial={false}>
            <SettingsRouter 
              key={view}
              currentView={view}
              setView={setView}
              onClose={() => onOpenChange(false)}
            />
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
