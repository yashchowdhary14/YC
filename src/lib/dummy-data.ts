
import type { Post, User } from '@/lib/types';

export const dummyUsers: (Omit<User, 'avatarUrl'> & { avatarUrl: string, bio: string, followersCount: number, followingCount: number, verified: boolean })[] = [
  { id: 'user_sachin', username: 'sachin', fullName: 'Sachin Tendulkar', avatarUrl: 'https://picsum.photos/seed/sachin/100/100', bio: 'Living and breathing cricket. 🏏', followersCount: 1000000, followingCount: 50, verified: true },
  { id: 'user_sakshi', username: 'sakshi', fullName: 'Sakshi Malik', avatarUrl: 'https://picsum.photos/seed/sakshi/100/100', bio: 'Wrestler | Olympian 🇮🇳', followersCount: 500000, followingCount: 25, verified: true },
  { id: 'user1', username: 'code_wizard', fullName: 'Alex Coder', avatarUrl: 'https://picsum.photos/seed/user1/100/100', bio: 'Developer and tech enthusiast.', followersCount: 1200, followingCount: 300, verified: false },
  { id: 'user2', username: 'design_diva', fullName: 'Brenda Designer', avatarUrl: 'https://picsum.photos/seed/user2/100/100', bio: 'Creating beautiful things.', followersCount: 5400, followingCount: 500, verified: false },
  { id: 'user3', username: 'photo_phan', fullName: 'Chris Photographer', avatarUrl: 'https://picsum.photos/seed/user3/100/100', bio: 'Capturing moments.', followersCount: 2300, followingCount: 150, verified: false },
  { id: 'user4', username: 'travel_bug', fullName: 'Diana Traveler', avatarUrl: 'https://picsum.photos/seed/user4/100/100', bio: 'Wanderlust-driven.', followersCount: 8900, followingCount: 800, verified: true },
  { id: 'user5', username: 'foodie_fiesta', fullName: 'Evan Eater', avatarUrl: 'https://picsum.photos/seed/user5/100/100', bio: 'Eating my way around the world.', followersCount: 4100, followingCount: 400, verified: false },
];

export const dummyPosts: (Omit<Post, 'user' | 'createdAt'> & { userId: string, createdAt: Date })[] = [
  // Sachin's Posts
  {
    id: 'sachin_post_1',
    userId: 'user_sachin',
    imageUrl: 'https://picsum.photos/seed/sachin_post1/500/500',
    imageHint: 'cricket stadium',
    caption: 'Another great day on the field!',
    likes: ['user1', 'user2', 'user3'],
    commentsCount: 150,
    createdAt: new Date('2023-10-26T10:00:00Z'),
  },
  {
    id: 'sachin_post_2',
    userId: 'user_sachin',
    imageUrl: 'https://picsum.photos/seed/sachin_post2/500/500',
    imageHint: 'trophy award',
    caption: 'Throwback to a memorable win.',
    likes: ['user1', 'user4', 'user5'],
    commentsCount: 200,
    createdAt: new Date('2023-10-25T15:30:00Z'),
  },
   {
    id: 'sachin_post_3',
    userId: 'user_sachin',
    imageUrl: 'https://picsum.photos/seed/sachin_post3/500/500',
    imageHint: 'team huddle',
    caption: 'Teamwork makes the dream work.',
    likes: [],
    commentsCount: 95,
    createdAt: new Date('2023-10-24T11:00:00Z'),
  },

  // Sakshi's Posts
  {
    id: 'sakshi_post_1',
    userId: 'user_sakshi',
    imageUrl: 'https://picsum.photos/seed/sakshi_post1/500/500',
    imageHint: 'gym workout',
    caption: 'Putting in the work. #NoPainNoGain',
    likes: ['user2', 'user3'],
    commentsCount: 80,
    createdAt: new Date('2023-10-26T09:00:00Z'),
  },
  {
    id: 'sakshi_post_2',
    userId: 'user_sakshi',
    imageUrl: 'https://picsum.photos/seed/sakshi_post2/500/500',
    imageHint: 'wrestling match',
    caption: 'Focused and ready for the next challenge.',
    likes: ['user1', 'user_sachin'],
    commentsCount: 120,
    createdAt: new Date('2023-10-25T18:00:00Z'),
  },
   {
    id: 'sakshi_post_3',
    userId: 'user_sakshi',
    imageUrl: 'https://picsum.photos/seed/sakshi_post3/500/500',
    imageHint: 'medals olympic',
    caption: 'Proud moment for the country!',
    likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
    commentsCount: 350,
    createdAt: new Date('2023-10-22T12:00:00Z'),
  },
];
