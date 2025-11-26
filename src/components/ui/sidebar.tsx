
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
        <Sheet open={open} onOpenChange={setOpen}>
            {children}
        </Sheet>
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
  return (
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
  );
}

export function SidebarInset({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
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

  return (
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="secondary"
            className={cn('h-8 w-8 p-0', className)}
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
      </SheetTrigger>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SheetHeader className="border-b px-4 py-2">
        <SheetTitle className="text-lg">{children}</SheetTitle>
      </SheetHeader>
    );
  }
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
