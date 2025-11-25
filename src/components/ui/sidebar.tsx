
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

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inset?: boolean;
}>({
  open: false,
  setOpen: () => {},
});

export const useSidebar = () => React.useContext(SidebarContext);

export function SidebarProvider({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  inset = false,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  inset?: boolean;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // If the 'open' and 'onOpenChange' props are provided, the component is controlled.
  // Otherwise, it is uncontrolled and manages its own state.
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const value = {open, setOpen, inset};

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
  anInset,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right';
  anInset?: boolean;
}) {
  const {open, setOpen, inset} = useSidebar();
  const isActuallyInset = inset !== undefined ? inset : anInset;

  if (isActuallyInset) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          className={cn(
            'flex h-full flex-col px-0 sm:max-w-xs',
            className
          )}
          {...props}
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-10 hidden h-full w-[260px] flex-col border-r border-zinc-800 p-4 md:flex',
        className
      )}
      {...props}
    >
      {children}
    </aside>
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
    <div className={cn('md:ml-[260px]', className)} {...props}>
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
  const {open, setOpen} = useSidebar();

  if (children) {
    return (
      <SheetTrigger asChild onClick={() => setOpen(!open)}>
        {children}
      </SheetTrigger>
    );
  }
  return (
    <SheetTrigger asChild>
      <Button
        variant="secondary"
        className={cn('h-8 w-8 p-0', className)}
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Open sidebar</span>
      </Button>
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
  const {inset} = useSidebar();

  if (inset) {
    return (
      <SheetHeader className="border-b px-4 py-2">
        <SheetTitle className="text-lg">{children}</SheetTitle>
      </SheetHeader>
    );
  }
  return (
    <div className={cn('flex items-center px-4', className)}>{children}</div>
  );
}

export function SidebarContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex-1 py-2', className)}>{children}</div>;
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
