
import type { Post, User } from '@/lib/types';

export const dummyUsers: User[] = [
  { id: 'user_sachin', username: 'sachin', fullName: 'Sachin Tendulkar', avatarUrl: 'https://picsum.photos/seed/sachin/100/100', bio: 'Living and breathing cricket. 🏏', followersCount: 1000000, followingCount: 50, verified: true },
  { id: 'user_sakshi', username: 'sakshi', fullName: 'Sakshi Malik', avatarUrl: 'https://picsum.photos/seed/sakshi/100/100', bio: 'Wrestler | Olympian 🇮🇳', followersCount: 500000, followingCount: 25, verified: true },
  { id: 'user_wanderlust_lila', username: 'wanderlust_lila', fullName: 'Lila Kim', avatarUrl: 'https://picsum.photos/seed/lila/100/100', bio: 'Chasing sunsets & city lights. ✈️\nProduct Designer @ Google.', followersCount: 1250, followingCount: 430, verified: true },
  { id: 'user_ethan_bytes', username: 'ethan_bytes', fullName: 'Ethan Byte', avatarUrl: 'https://picsum.photos/seed/ethan/100/100', bio: 'Building the future, one line of code at a time. Rust Evangelist. Coffee Addict.', followersCount: 2800, followingCount: 150, verified: false },
  { id: 'user_maya_creates', username: 'maya_creates', fullName: 'Maya Singh', avatarUrl: 'https://picsum.photos/seed/maya/100/100', bio: 'Illustrator & storyteller. Painting my world with color.', followersCount: 15200, followingCount: 300, verified: true },
  { id: 'user_leo_the_lion', username: 'leo_the_lion', fullName: 'Leo Chen', avatarUrl: 'https://picsum.photos/seed/leo/100/100', bio: 'Fitness, finance, and philosophy. Striving for 1% better every day.', followersCount: 890, followingCount: 890, verified: false },
  { id: 'user_chloe_films', username: 'chloe_films', fullName: 'Chloé Dubois', avatarUrl: 'https://picsum.photos/seed/chloe/100/100', bio: 'Cinematographer. Seeing the world through a lens.', followersCount: 45000, followingCount: 120, verified: true },
  { id: 'user_sam_reviews', username: 'sam_reviews', fullName: 'Sam Jones', avatarUrl: 'https://picsum.photos/seed/sam/100/100', bio: 'Unboxing the latest tech gadgets. YouTuber. ⬇️', followersCount: 120000, followingCount: 95, verified: true },
  { id: 'user_astro_gaze', username: 'astro_gaze', fullName: 'Dr. Aris Thorne', avatarUrl: 'https://picsum.photos/seed/aris/100/100', bio: 'Astrophysicist. Exploring the cosmos from my backyard telescope. ✨', followersCount: 730, followingCount: 210, verified: false },
  { id: 'user_urban_eats', username: 'urban_eats', fullName: 'Javier Rodriguez', avatarUrl: 'https://picsum.photos/seed/javier/100/100', bio: 'Food blogger on a quest to find the best tacos in every city. 🌮', followersCount: 9800, followingCount: 650, verified: false },
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
