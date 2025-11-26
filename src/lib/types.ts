
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
