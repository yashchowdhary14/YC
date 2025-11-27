
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { formatCompactNumber } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoCardProps {
  video: Post;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mock duration - in real app, this would come from video metadata
  const duration = "12:34";

  return (
    <div className="flex flex-col gap-3 group">
      <Link href={`/watch/${video.id}`}>
        <div
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Thumbnail Image */}
          <Image
            src={video.thumbnailUrl}
            alt={video.caption}
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Video Preview */}
          {isHovered && (
            <video
              src={video.mediaUrls ? video.mediaUrls[0] : video.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-semibold text-white z-10">
            {duration}
          </div>

          {/* Play Icon Overlay (Only show if NOT hovering/playing) */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <div className="bg-white/90 rounded-full p-3 transform transition-transform duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 text-black fill-black" />
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-3">
        <Link href={`/${video.user.username}`} className="shrink-0">
          <Avatar className="transition-transform duration-200 hover:scale-110">
            <AvatarImage src={video.user.avatarUrl} />
            <AvatarFallback>{video.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/watch/${video.id}`}>{video.caption}</Link>
          </h3>
          <Link href={`/${video.user.username}`} className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors">
            {video.user.username}
          </Link>
          <p className="text-sm text-muted-foreground">
            {formatCompactNumber(video.views)} views &bull;{' '}
            {formatDistanceToNow(video.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
