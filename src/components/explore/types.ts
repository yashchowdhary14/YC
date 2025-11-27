
import type { Post, LiveBroadcast } from '@/lib/types';

export type ExploreItem = (Post | LiveBroadcast) & {
    // This allows us to use a unified type in the grid,
    // while still having type-specific fields.
    // We'll use a type guard to differentiate.
    type: 'photo' | 'video' | 'reel' | 'live';
    id: string; // From Post
    liveId?: string; // From LiveBroadcast
    thumbnailUrl: string; // from Post
    liveThumbnail?: string; // from LiveBroadcast
    caption?: string; // from Post
    title?: string; // from LiveBroadcast
    likes?: number; // from Post
    commentsCount?: number; // from Post
    viewerCount?: number; // from LiveBroadcast
    streamerName?: string; // from LiveBroadcast
};
