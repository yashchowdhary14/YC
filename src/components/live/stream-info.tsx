
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, User, CheckCircle } from 'lucide-react';
import type { User as UserType } from '@/lib/types';
import { formatCompactNumber } from '@/lib/utils';
import Link from 'next/link';

interface StreamInfoProps {
  streamer: UserType;
  stream: {
    title: string;
    category: string;
    viewers: number;
  };
}

export default function StreamInfo({ streamer, stream }: StreamInfoProps) {
  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Link href={`/${streamer.username}`}>
            <Avatar className="w-16 h-16 border-4 border-primary">
                <AvatarImage src={streamer.avatarUrl} alt={streamer.username} />
                <AvatarFallback>{streamer.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{streamer.fullName}</h2>
            {streamer.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-current" />}
          </div>
          <h1 className="text-lg font-semibold text-foreground/90 mt-1">{stream.title}</h1>
          <div className="flex items-center gap-2 mt-1">
             <Link href="/search" className="text-primary font-semibold text-sm hover:underline">{stream.category}</Link>
          </div>
        </div>
        <div className="flex sm:flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
                <Button>Follow</Button>
                <Button variant="secondary">Subscribe</Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Eye className="h-4 w-4 text-red-500" />
                <span>{formatCompactNumber(stream.viewers)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
