
import type { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  fullName: string;
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
  // We can add user details here if needed, but for now we'll fetch them separately
  // to keep the chat document light.
  userDetails: User[];
}
