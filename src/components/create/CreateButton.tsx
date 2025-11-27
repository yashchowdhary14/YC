
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CreateButtonProps = {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
};

export function CreateButton({ onClick, size = 'md' }: CreateButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open Create"
      onClick={onClick}
      className={cn('rounded-full', sizeClasses[size])}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
