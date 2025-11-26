
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
  user: User;
  imageUrl: string;
  imageHint: string;
  caption: string;
  createdAt: Date;
  likes: string[];
  commentsCount: number;
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

export interface Reel {
    id: string;
    videoUrl: string;
    thumbnailUrl?: string;
    user: User;
    caption: string;
    likes: number;
    isLiked: boolean;
    comments: ReelComment[];
    commentsCount: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  user: User;
  views: number;
  createdAt: any; // Can be Date or Timestamp
  category: string;
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

export interface Stream {
  id: string;
  user: User;
  streamerId: string;
  title: string;
  category: string;
  tags: string[];
  viewerCount: number;
  isLive: boolean;
  thumbnailUrl?: string;
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
