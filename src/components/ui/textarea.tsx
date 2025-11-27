
import * as React from 'react';

import {cn} from '@/lib/utils';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & { autosize?: boolean } & Omit<TextareaAutosizeProps, 'ref'>
>(({ className, autosize = false, ...props }, ref) => {
  
  const sharedClasses = cn(
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    className
  );

  const isAutosize = 'minRows' in props || 'maxRows' in props || autosize;

  if (isAutosize) {
    return <TextareaAutosize className={sharedClasses} ref={ref as any} {...props} />;
  }

  return (
    <textarea
      className={cn(sharedClasses, 'min-h-[80px]')}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export {Textarea};
