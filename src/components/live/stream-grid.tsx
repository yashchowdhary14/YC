
'use client';

import type { Stream } from '@/lib/types';
import StreamCard from './stream-card';

interface StreamGridProps {
  streams: Stream[];
}

export default function StreamGrid({ streams }: StreamGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {streams.map(stream => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
