
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { formatCompactNumber } from '@/lib/utils';
import type { Video } from '@/lib/types';

interface RelatedVideoCardProps {
  video: Video;
}

export default function RelatedVideoCard({ video }: RelatedVideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className="flex gap-3 group">
      <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-muted transition-transform group-hover:scale-105">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground">{video.user.username}</p>
        <p className="text-xs text-muted-foreground">
          {formatCompactNumber(video.views)} views &bull;{' '}
          {formatDistanceToNow(video.createdAt, { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
}
