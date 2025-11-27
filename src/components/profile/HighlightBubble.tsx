
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface HighlightBubbleProps {
  id?: string;
  coverUrl?: string;
  label: string;
  isNew?: boolean;
  onClick?: () => void;
}

export function HighlightBubble({ coverUrl, label, isNew = false, onClick }: HighlightBubbleProps) {
  return (
    <motion.div
      className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative transition-transform duration-200 ease-in-out group-hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-muted group-hover:border-primary/50 transition-colors">
          <AvatarImage src={coverUrl} alt={label} />
          <AvatarFallback className="bg-secondary">
            {isNew ? (
              <Plus className="w-8 h-8 text-muted-foreground" />
            ) : (
              label?.[0]?.toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
      </motion.div>
      <p className="text-xs text-center w-20 truncate">{label}</p>
    </motion.div>
  );
}
