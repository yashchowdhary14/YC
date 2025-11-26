
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Stream } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCompactNumber } from '@/lib/utils';
import { AspectRatio } from '../ui/aspect-ratio';

interface StreamCardProps {
  stream: Stream;
}

export default function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link href={`/${stream.user.username}`} className="group">
      <div className="relative mb-2 overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9} className="bg-zinc-800 rounded-lg overflow-hidden">
            <Image
                src={stream.thumbnailUrl!}
                alt={stream.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
        </AspectRatio>
        <div className="absolute top-2 left-2">
          <Badge variant="destructive" className="bg-red-600 font-bold">LIVE</Badge>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-md text-xs">
          {formatCompactNumber(stream.viewerCount)} viewers
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={stream.user.avatarUrl} alt={stream.user.username} />
          <AvatarFallback>{stream.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-white truncate group-hover:text-primary">
            {stream.title}
          </h3>
          <p className="text-sm text-zinc-400">{stream.user.username}</p>
          <p className="text-sm text-zinc-400">{stream.category}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {stream.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
