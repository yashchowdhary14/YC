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
  likes: number;
  commentsCount: number;
}
