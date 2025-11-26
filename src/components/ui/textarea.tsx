
import * as React from 'react';

import {cn} from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>((
  {className, ...props},
  ref
) => {
  // Check if the component should behave as a regular textarea or an autosizing one
  // Based on the presence of specific props, or you could introduce a new prop like `autosize`.
  // For now, we'll assume if you don't provide `minRows` or `maxRows`, you want the default.
  const isAutosize = 'minRows' in props || 'maxRows' in props;
  
  const sharedClasses = cn(
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    className
  );

  if (isAutosize) {
    return <TextareaAutosize className={sharedClasses} ref={ref} {...props} />;
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
