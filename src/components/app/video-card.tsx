
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { formatCompactNumber } from '@/lib/utils';
import type { Video } from '@/lib/types';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link href={`/watch/${video.id}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted transition-transform hover:scale-105">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex gap-3">
        <Link href={`/${video.user.username}`}>
          <Avatar>
            <AvatarImage src={video.user.avatarUrl} />
            <AvatarFallback>{video.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <h3 className="font-semibold text-base leading-tight">
            <Link href={`/watch/${video.id}`}>{video.title}</Link>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{video.user.username}</p>
          <p className="text-sm text-muted-foreground">
            {formatCompactNumber(video.views)} views &bull;{' '}
            {formatDistanceToNow(video.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
