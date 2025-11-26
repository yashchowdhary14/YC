
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
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9} className="bg-zinc-800 rounded-lg overflow-hidden">
            <Image
                src={stream.thumbnailUrl!}
                alt={stream.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute top-2 left-2">
                <Badge variant="destructive" className="bg-red-600 font-bold uppercase text-xs h-5">Live</Badge>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                {formatCompactNumber(stream.viewerCount)} viewers
            </div>
        </AspectRatio>
      </div>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={stream.user.avatarUrl} alt={stream.user.username} />
          <AvatarFallback>{stream.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <h3 className="font-bold text-white truncate group-hover:text-primary text-base">
            {stream.title}
          </h3>
          <p className="text-sm text-zinc-400 truncate">{stream.user.username}</p>
          <p className="text-sm text-zinc-400 truncate">{stream.category}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {stream.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs font-semibold bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
