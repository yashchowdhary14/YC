
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
} from './sheet';

import {cn} from '@/lib/utils';
import {Button} from './button';
import { useIsMobile } from '@/hooks/use-mobile';


const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

export const useSidebar = () => React.useContext(SidebarContext);

export function SidebarProvider({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;
  
  const value = {open, setOpen};

  return (
    <SidebarContext.Provider value={value}>
        {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  className,
  side = 'left',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right';
}) {
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  // This component now ONLY renders the mobile, slide-out functionality.
  // The persistent desktop sidebars are handled directly in the root layout.
  if (!isMobile) {
    return null;
  }

  return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          className={cn(
            'flex h-full flex-col px-0 w-72',
            className
          )}
          {...props}
        >
          {children}
        </SheetContent>
      </Sheet>
  );
}

export function SidebarTrigger({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  // The trigger should only be visible on mobile to control the sheet.
  if (!isMobile) {
    return null;
  }

  return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(className)}
        onClick={() => setOpen(!open)}
      >
        {children || <span className="sr-only">Toggle sidebar</span>}
      </Button>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
    return (
      <div className={cn('flex h-14 items-center border-b p-4', className)}>{children}</div>
    );
}

export function SidebarContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex-1 py-2 overflow-y-auto', className)}>{children}</div>;
}

export function SidebarFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mt-auto border-t p-2', className)}>{children}</div>
  );
}
