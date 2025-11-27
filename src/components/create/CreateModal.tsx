
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile";
import CreateChoiceScreen from "./CreateChoiceScreen";

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateModal({ open, onClose }: CreateModalProps) {
  const isMobile = useIsMobile();

  const handleSelect = (type: string) => {
    console.log(`selected: ${type}`);
    // For now, just close the modal. Later steps will navigate to the specific flow.
    onClose();
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[60vh] flex flex-col rounded-t-2xl p-0">
          <div className="w-full pt-3 pb-2 flex justify-center">
            <div className="w-8 h-1 bg-muted rounded-full" />
          </div>
          <SheetHeader className="text-center pb-2 border-b">
            <SheetTitle>Create</SheetTitle>
          </SheetHeader>
          <div className="p-4 flex-1">
            <CreateChoiceScreen onSelect={handleSelect} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold border-b pb-4">Create new post</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <CreateChoiceScreen onSelect={handleSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
