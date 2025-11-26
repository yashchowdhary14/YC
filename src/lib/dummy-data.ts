
import type { Post, User, Chat, Message, Reel, ReelComment, Video, Stream, Category } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

export const dummyUsers: (Omit<User, 'avatarUrl'> & { avatarUrl?: string })[] = [
  { id: 'user_sachin', username: 'sachin', fullName: 'Sachin Tendulkar', bio: 'Living and breathing cricket. 🏏', followersCount: 1000000, followingCount: 50, verified: true },
  { id: 'user_sakshi', username: 'sakshi', fullName: 'Sakshi Malik', bio: 'Wrestler | Olympian 🇮🇳', followersCount: 500000, followingCount: 25, verified: true },
  { id: 'user_wanderlust_lila', username: 'wanderlust_lila', fullName: 'Lila Kim', bio: 'Chasing sunsets & city lights. ✈️\nProduct Designer @ Google.', followersCount: 1250, followingCount: 430, verified: true },
  { id: 'user_ethan_bytes', username: 'ethan_bytes', fullName: 'Ethan Byte', bio: 'Building the future, one line of code at a time. Rust Evangelist. Coffee Addict.', followersCount: 2800, followingCount: 150, verified: false },
  { id: 'user_maya_creates', username: 'maya_creates', fullName: 'Maya Singh', bio: 'Illustrator & storyteller. Painting my world with color.', followersCount: 15200, followingCount: 300, verified: true },
  { id: 'user_leo_the_lion', username: 'leo_the_lion', fullName: 'Leo Chen', bio: 'Fitness, finance, and philosophy. Striving for 1% better every day.', followersCount: 890, followingCount: 890, verified: false },
  { id: 'user_chloe_films', username: 'chloe_films', fullName: 'Chloé Dubois', bio: 'Cinematographer. Seeing the world through a lens.', followersCount: 45000, followingCount: 120, verified: true },
  { id: 'user_sam_reviews', username: 'sam_reviews', fullName: 'Sam Jones', bio: 'Unboxing the latest tech gadgets. YouTuber. ⬇️', followersCount: 120000, followingCount: 95, verified: true },
  { id: 'user_astro_gaze', username: 'astro_gaze', fullName: 'Dr. Aris Thorne', bio: 'Astrophysicist. Exploring the cosmos from my backyard telescope. ✨', followersCount: 730, followingCount: 210, verified: false },
  { id: 'user_urban_eats', username: 'urban_eats', fullName: 'Javier Rodriguez', bio: 'Food blogger on a quest to find the best tacos in every city. 🌮', followersCount: 9800, followingCount: 650, verified: false },
];

export const dummyPosts: (Omit<Post, 'user' | 'createdAt' | 'imageUrl' | 'imageHint' > & { userId: string, createdAt: Date, imageId: string })[] = [
  // Sachin's Posts
  { id: 'sachin_post_1', userId: 'user_sachin', imageId: "1", caption: 'Another great day on the field!', likes: ['user_sakshi', 'user_ethan_bytes'], commentsCount: 150, createdAt: new Date('2023-10-26T10:00:00Z') },
  { id: 'sachin_post_2', userId: 'user_sachin', imageId: "2", caption: 'Throwback to a memorable win.', likes: ['user_wanderlust_lila', 'user_maya_creates'], commentsCount: 200, createdAt: new Date('2023-10-25T15:30:00Z') },
  { id: 'sachin_post_3', userId: 'user_sachin', imageId: "3", caption: 'Teamwork makes the dream work.', likes: [], commentsCount: 95, createdAt: new Date('2023-10-24T11:00:00Z') },
  // Sakshi's Posts
  { id: 'sakshi_post_1', userId: 'user_sakshi', imageId: "4", caption: 'Putting in the work. #NoPainNoGain', likes: ['user_ethan_bytes', 'user_sachin'], commentsCount: 80, createdAt: new Date('2023-10-26T09:00:00Z') },
  { id: 'sakshi_post_2', userId: 'user_sakshi', imageId: "5", caption: 'Focused and ready for the next challenge.', likes: ['user_sachin'], commentsCount: 120, createdAt: new Date('2023-10-25T18:00:00Z') },
  { id: 'sakshi_post_3', userId: 'user_sakshi', imageId: "6", caption: 'Proud moment for the country!', likes: ['user_sachin', 'user_ethan_bytes', 'user_leo_the_lion'], commentsCount: 350, createdAt: new Date('2023-10-22T12:00:00Z') },
  // Wanderlust Lila's Posts
  { id: 'lila_post_1', userId: 'user_wanderlust_lila', imageId: "7", caption: 'Paris is always a good idea.', likes: ['user_maya_creates'], commentsCount: 45, createdAt: new Date('2023-10-27T12:00:00Z') },
  { id: 'lila_post_2', userId: 'user_wanderlust_lila', imageId: "8", caption: 'Tokyo vibes 🌃', likes: ['user_ethan_bytes', 'user_sam_reviews'], commentsCount: 60, createdAt: new Date('2023-10-20T19:00:00Z') },
  // Ethan's Posts
  { id: 'ethan_post_1', userId: 'user_ethan_bytes', imageId: "9", caption: 'New setup, who dis?', likes: ['user_sam_reviews', 'user_leo_the_lion'], commentsCount: 110, createdAt: new Date('2023-10-26T14:00:00Z') },
];

const dummyComments: ReelComment[] = [
    {id: 'c1', user: 'ethan_bytes', profilePic: `https://picsum.photos/seed/user_ethan_bytes/100/100`, text: 'This is amazing!', likes: 12, timeAgo: '2h', isLiked: false},
    {id: 'c2', user: 'maya_creates', profilePic: `https://picsum.photos/seed/user_maya_creates/100/100`, text: 'So inspiring! ❤️', likes: 25, timeAgo: '3h', isLiked: true},
    {id: 'c3', user: 'sam_reviews', profilePic: `https://picsum.photos/seed/user_sam_reviews/100/100`, text: 'Incredible shot!', likes: 5, timeAgo: '1d', isLiked: false},
    {id: 'c4', user: 'leo_the_lion', profilePic: `https://picsum.photos/seed/user_leo_the_lion/100/100`, text: 'Let\'s gooo! 🚀', likes: 2, timeAgo: '1d', isLiked: false},
];

export const dummyReels: Reel[] = [
    {
        id: 'reel_1',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        user: { ...dummyUsers[2], avatarUrl: `https://picsum.photos/seed/${dummyUsers[2].id}/100/100` } as User,
        caption: 'Living my best life in the mountains! 🏔️',
        likes: 1234,
        isLiked: false,
        comments: dummyComments,
        commentsCount: 4,
    },
    {
        id: 'reel_2',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        user: { ...dummyUsers[4], avatarUrl: `https://picsum.photos/seed/${dummyUsers[4].id}/100/100` } as User,
        caption: 'City lights and late nights ✨',
        likes: 567,
        isLiked: true,
        comments: [dummyComments[2]],
        commentsCount: 1,
    },
    {
        id: 'reel_3',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        user: { ...dummyUsers[6], avatarUrl: `https://picsum.photos/seed/${dummyUsers[6].id}/100/100` } as User,
        caption: 'The art of filmmaking.',
        likes: 8910,
        isLiked: false,
        comments: [],
        commentsCount: 98,
    },
    {
        id: 'reel_4',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        user: { ...dummyUsers[7], avatarUrl: `https://picsum.photos/seed/${dummyUsers[7].id}/100/100` } as User,
        caption: 'Just another unboxing. You HAVE to see this!',
        likes: 11200,
        isLiked: false,
        comments: [],
        commentsCount: 150,
    },
    {
        id: 'reel_5',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        user: { ...dummyUsers[9], avatarUrl: `https://picsum.photos/seed/${dummyUsers[9].id}/100/100` } as User,
        caption: 'Best tacos I have ever had. Period. 🌮',
        likes: 432,
        isLiked: true,
        comments: [],
        commentsCount: 77,
    }
];

export const dummyVideos: Video[] = [
  {
    id: 'vid_1',
    title: 'How to build a Next.js app in 10 minutes',
    thumbnailUrl: 'https://picsum.photos/seed/vid1/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    user: { ...dummyUsers[3], avatarUrl: `https://picsum.photos/seed/${dummyUsers[3].id}/100/100` } as User,
    views: 150234,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: 'Tech',
  },
  {
    id: 'vid_2',
    title: 'The Secret to Perfect Sourdough',
    thumbnailUrl: 'https://picsum.photos/seed/vid2/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    user: { ...dummyUsers[9], avatarUrl: `https://picsum.photos/seed/${dummyUsers[9].id}/100/100` } as User,
    views: 89034,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: 'Food',
  },
  {
    id: 'vid_3',
    title: 'My Desk Setup Tour 2024',
    thumbnailUrl: 'https://picsum.photos/seed/vid3/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    user: { ...dummyUsers[7], avatarUrl: `https://picsum.photos/seed/${dummyUsers[7].id}/100/100` } as User,
    views: 1200543,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: 'Tech',
  },
  {
    id: 'vid_4',
    title: 'Beginner\'s Guide to Astrophotography',
    thumbnailUrl: 'https://picsum.photos/seed/vid4/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    user: { ...dummyUsers[8], avatarUrl: `https://picsum.photos/seed/${dummyUsers[8].id}/100/100` } as User,
    views: 4523,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    category: 'Science',
  },
  {
    id: 'vid_5',
    title: 'A Cinematic Journey Through Japan',
    thumbnailUrl: 'https://picsum.photos/seed/vid5/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    user: { ...dummyUsers[6], avatarUrl: `https://picsum.photos/seed/${dummyUsers[6].id}/100/100` } as User,
    views: 230987,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    category: 'Travel',
  },
  {
    id: 'vid_6',
    title: 'My Favorite Watercolor Techniques',
    thumbnailUrl: 'https://picsum.photos/seed/vid6/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    user: { ...dummyUsers[4], avatarUrl: `https://picsum.photos/seed/${dummyUsers[4].id}/100/100` } as User,
    views: 76543,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    category: 'Art',
  },
    {
    id: 'vid_7',
    title: 'Daily Workout Routine for Max Gains',
    thumbnailUrl: 'https://picsum.photos/seed/vid7/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    user: { ...dummyUsers[5], avatarUrl: `https://picsum.photos/seed/${dummyUsers[5].id}/100/100` } as User,
    views: 12345,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: 'Fitness',
  },
  {
    id: 'vid_8',
    title: 'Cricket Masterclass: The Cover Drive',
    thumbnailUrl: 'https://picsum.photos/seed/vid8/640/360',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    user: { ...dummyUsers[0], avatarUrl: `https://picsum.photos/seed/${dummyUsers[0].id}/100/100` } as User,
    views: 2500000,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    category: 'Sports',
  },
];

export const dummyFollows: { [key: string]: string[] } = {
  'user_sachin': ['user_sakshi', 'user_wanderlust_lila'],
  'user_sakshi': ['user_sachin'],
  'user_wanderlust_lila': ['user_maya_creates', 'user_ethan_bytes'],
  'user_ethan_bytes': ['user_wanderlust_lila', 'user_sam_reviews'],
  'user_maya_creates': ['user_wanderlust_lila', 'user_chloe_films'],
  'user_leo_the_lion': ['user_ethan_bytes'],
  'user_chloe_films': [],
  'user_sam_reviews': ['user_ethan_bytes'],
  'user_astro_gaze': [],
  'user_urban_eats': [],
};

const generateMessages = (chatId: string, user1Id: string, user2Id: string): Message[] => {
  const messages: Message[] = [];
  const conversation = [
    { sender: user1Id, text: 'Hey, how are you?' },
    { sender: user2Id, text: 'I am good, thanks! How about you?' },
    { sender: user1Id, text: 'Doing great! Just saw your latest post, awesome shot!' },
    { sender: user2Id, text: 'Thanks so much! Glad you liked it.' },
    { sender: user1Id, text: 'We should catch up sometime.' },
    { sender: user2Id, text: 'Definitely! Next week?' },
    { sender: user1Id, text: 'Sounds good to me.' },
    { sender: user2Id, text: 'Cool, talk to you then! 👋' },
    { sender: user1Id, text: '👍' },
    { sender: user1Id, text: 'Oh, check this out!', mediaUrl: 'https://picsum.photos/seed/chat_media_1/400/400' },
  ];
  conversation.forEach((msg, index) => {
    messages.push({
      id: `${chatId}-msg-${index}`,
      chatId,
      senderId: msg.sender,
      text: msg.text,
      mediaUrl: msg.mediaUrl,
      timestamp: new Date(Date.now() - (10 - index) * 60000), // Mins ago
      isRead: true,
    });
  });
  return messages;
};

const createChat = (user1Id: string, user2Id: string): Chat => {
  const sortedIds = [user1Id, user2Id].sort();
  const chatId = sortedIds.join('_');
  const messages = generateMessages(chatId, user1Id, user2Id);
  return {
    id: chatId,
    users: sortedIds,
    messages: messages,
    lastMessage: messages[messages.length - 1],
    userDetails: [],
  };
};

export let dummyChats: Chat[] = [
  createChat('user_sachin', 'user_sakshi'),
  createChat('user_wanderlust_lila', 'user_ethan_bytes'),
  createChat('user_maya_creates', 'user_chloe_films'),
  createChat('user_sachin', 'user_ethan_bytes'),
];

export function getChat(chatId: string) {
  let chat = dummyChats.find(c => c.id === chatId);
  if (!chat) {
    const userIds = chatId.split('_');
    if (userIds.length === 2 && dummyUsers.find(u => u.id === userIds[0]) && dummyUsers.find(u => u.id === userIds[1])) {
      const newChat: Chat = {
        id: chatId,
        users: userIds,
        messages: [],
        userDetails: [],
      };
      dummyChats.push(newChat);
      return newChat;
    }
    return undefined;
  }
  return chat;
}

export function addMessageToChat(chatId: string, message: Message) {
  const chatIndex = dummyChats.findIndex(c => c.id === chatId);
  if (chatIndex !== -1) {
    dummyChats[chatIndex].messages.push(message);
    dummyChats[chatIndex].lastMessage = message;
    return true;
  }
  return false;
}

export const dummyCategories: Category[] = [
    { id: 'cat_1', name: 'Just Chatting', thumbnailUrl: 'https://picsum.photos/seed/cat1/285/380' },
    { id: 'cat_2', name: 'Valorant', thumbnailUrl: 'https://picsum.photos/seed/cat2/285/380' },
    { id: 'cat_3', name: 'Counter-Strike', thumbnailUrl: 'https://picsum.photos/seed/cat3/285/380' },
    { id: 'cat_4', name: 'Art', thumbnailUrl: 'https://picsum.photos/seed/cat4/285/380' },
    { id: 'cat_5', name: 'Music', thumbnailUrl: 'https://picsum.photos/seed/cat5/285/380' },
    { id: 'cat_6', name: 'Travel & Outdoors', thumbnailUrl: 'https://picsum.photos/seed/cat6/285/380' },
    { id: 'cat_7', name: 'Software and Game Development', thumbnailUrl: 'https://picsum.photos/seed/cat7/285/380' },
    { id: 'cat_8', name: 'Fitness', thumbnailUrl: 'https://picsum.photos/seed/cat8/285/380' },
];

export const dummyStreams: Omit<Stream, 'user'>[] = [
    {
        id: 'stream_1',
        streamerId: 'user_ethan_bytes',
        title: 'Building a Real-time App with Rust',
        category: 'Software and Game Development',
        tags: ['Programming', 'Rust', 'Web Dev'],
        viewerCount: 12800,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream1/640/360',
    },
    {
        id: 'stream_2',
        streamerId: 'user_maya_creates',
        title: 'Morning Sketch Session 🎨',
        category: 'Art',
        tags: ['Illustration', 'Creative', 'Digital Art'],
        viewerCount: 7500,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream2/640/360',
    },
    {
        id: 'stream_3',
        streamerId: 'user_sam_reviews',
        title: 'Unboxing the new M4 Laptop!',
        category: 'Tech',
        tags: ['Unboxing', 'Tech', 'Review'],
        viewerCount: 25000,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream3/640/360',
    },
    {
        id: 'stream_4',
        streamerId: 'user_sakshi',
        title: 'Training for the championship',
        category: 'Fitness',
        tags: ['Wrestling', 'Training', 'Workout'],
        viewerCount: 9800,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream4/640/360',
    },
    {
        id: 'stream_5',
        streamerId: 'user_sachin',
        title: 'Discussing the latest match',
        category: 'Sports',
        tags: ['Cricket', 'Sports Talk'],
        viewerCount: 50000,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream5/640/360',
    },
    {
        id: 'stream_6',
        streamerId: 'user_wanderlust_lila',
        title: 'Live from the Swiss Alps!',
        category: 'Travel & Outdoors',
        tags: ['Travel', 'Hiking', 'Nature'],
        viewerCount: 4200,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream6/640/360',
    },
    {
        id: 'stream_7',
        streamerId: 'user_urban_eats',
        title: 'Taco Tuesday! Rating local taquerias.',
        category: 'Just Chatting',
        tags: ['Food', 'IRL', 'Rating'],
        viewerCount: 1200,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream7/640/360',
    },
    {
        id: 'stream_8',
        streamerId: 'user_chloe_films',
        title: 'Editing my latest short film - AMA',
        category: 'Art',
        tags: ['Filmmaking', 'Editing', 'Creative'],
        viewerCount: 3400,
        isLive: true,
        thumbnailUrl: 'https://picsum.photos/seed/stream8/640/360',
    },
];
