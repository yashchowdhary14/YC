
import type { User } from '@/lib/types';

export interface ExploreItem {
    id: string;
    type: 'photo' | 'video' | 'reel' | 'live';
    imageUrl: string;
    imageHint: string;
    likes?: number;
    comments?: number;
    viewerCount?: number;
    streamer?: User;
}
