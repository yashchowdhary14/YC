
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  fullName: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  verified: boolean;
}

export interface Post {
  id: string;
  type: 'photo' | 'reel' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  uploaderId: string;
  user: User;
  caption: string;
  tags: string[];
  views: number;
  likes: number;
  commentsCount: number;
  createdAt: Date;
}

export interface LiveBroadcast {
  liveId: string;
  streamerId: string;
  streamerName: string;
  user: User; // Re-using User type for streamer details
  avatarUrl: string;
  viewerCount: number;
  liveThumbnail: string;
  category: string;
  title: string;
  isLive: boolean;
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
  id:string;
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
