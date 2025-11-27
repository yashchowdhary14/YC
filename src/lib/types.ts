
export interface User {
  id: string;
  username: string;
  avatarUrl?: string; // Made optional as it might not be present everywhere
  profilePhoto?: string;
  fullName: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  followers?: string[];
  following?: string[];
  verified: boolean;
}

export interface Post {
  id: string;
  type: 'photo' | 'reel' | 'video';
  mediaUrls: string[];
  thumbnailUrl: string;
  uploaderId: string;
  user: User;
  caption: string;
  location?: string;
  category?: string;
  tags: string[];
  taggedUsers?: Record<string, string[]>;
  accessibility?: {
    alt: string[];
  };
  views: number;
  likes: number;
  hideLikes?: boolean;
  disableComments?: boolean;
  disableRemix?: boolean;
  visibility?: "public" | "unlisted" | "private";
  commentsCount: number;
  createdAt: any; // Can be Date or Timestamp
  comments?: ReelComment[]; // Optional for reels
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  type: 'photo' | 'video';
  createdAt: any;
  expiresAt: any;
  highlighted?: boolean;
}

export interface Highlight {
  id: string;
  userId: string;
  title: string;
  coverImage: string;
  storyIds: string[];
  createdAt: any;
}


export interface LiveBroadcast {
  id: string;
  liveId: string;
  streamerId: string;
  streamerName: string;
  user: User; // Re-using User type for streamer details
  viewerCount: number;
  liveThumbnail: string;
  category: string;
  title: string;
  isLive: boolean;
  streamUrl: string;
  type?: 'live';
}

export interface ReelComment {
  id: string;
  user: string;
  profilePic: string;
  text: string;
  likes: number;
  timeAgo: string;
  isLiked: boolean;
}

export interface VideoComment {
  id: string;
  text: string;
  createdAt: any; // Can be Date or Timestamp
  user: User;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Chat {
  id: string;
  users: string[]; // Array of user IDs
  messages: Message[];
  lastMessage?: Message;
  userDetails: User[];
}

export interface Category {
  id: string;
  name: string;
  thumbnailUrl: string;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: any; // Can be Date or FieldValue
  color?: string;
  isBot?: boolean;
}



