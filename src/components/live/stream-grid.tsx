
'use client';

import type { LiveBroadcast } from '@/lib/types';
import StreamCard from './stream-card';
import { WithId } from '@/firebase';

interface StreamGridProps {
  streams: WithId<LiveBroadcast>[];
}

export default function StreamGrid({ streams }: StreamGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
      {streams.map(stream => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
