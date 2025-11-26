
import type { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  fullName: string;
  createdAt?: Timestamp;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  imageHint: string;
  caption: string;
  createdAt: Date;
  likes: string[]; // Changed from number to string[]
  commentsCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp | Date;
  isRead: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Chat {
  id: string;
  users: string[]; // Array of user IDs
  lastMessage?: Message;
  lastUpdated?: Timestamp;
  userDetails: User[];
}
