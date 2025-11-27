
import type { Post, User, Chat, Message, LiveBroadcast, ReelComment, VideoComment, Category, LiveChatMessage } from '@/lib/types';
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

export const getHydratedUser = (userId: string): User => {
<<<<<<< HEAD
  const user = dummyUsers.find(u => u.id === userId)!;
  return {
    ...user,
    avatarUrl: `https://picsum.photos/seed/${userId}/100/100`
  }
};

const generateReelComments = (count: number): ReelComment[] => {
  return Array.from({ length: count }).map((_, i) => {
    const user = dummyUsers[i % dummyUsers.length];
    return {
      id: `comment-${Date.now()}-${i}`,
      user: user.username,
      profilePic: `https://picsum.photos/seed/${user.id}/100`,
      text: `This is a fantastic reel! Great job! #${i + 1}`,
      likes: (i * 13 + 5),
      timeAgo: `${(i * 3 + 1)}m`,
      isLiked: (i % 5) === 0
    }
  })
}

const createDummyPosts = (): Post[] => {
  const posts: Post[] = [];

  // Photos
  PlaceHolderImages.forEach((img, index) => {
    const user = dummyUsers[index % dummyUsers.length];
    posts.push({
      id: `photo_${img.id}`,
      type: 'photo',
      mediaUrls: [img.imageUrl],
      thumbnailUrl: img.imageUrl,
      uploaderId: user.id,
      user: getHydratedUser(user.id),
      caption: img.description,
      tags: ['photography', img.imageHint.split(' ')[0]],
      views: (index + 1) * 1234,
      likes: (index + 1) * 243,
      commentsCount: (index + 1) * 37,
      createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
    });
  });

  // Add a multi-image post for testing
  posts.push({
    id: 'photo_multi_test',
    type: 'photo',
    mediaUrls: [
      PlaceHolderImages[0].imageUrl,
      PlaceHolderImages[1].imageUrl,
      PlaceHolderImages[2].imageUrl
    ],
    thumbnailUrl: PlaceHolderImages[0].imageUrl,
    uploaderId: dummyUsers[0].id,
    user: getHydratedUser(dummyUsers[0].id),
    caption: 'Testing the new Carousel feature! 📸✨',
    tags: ['carousel', 'test'],
    taggedUsers: {
      '0': ['sachin', 'sakshi'],
      '1': ['wanderlust_lila'],
      '2': []
    },
    location: 'Mumbai, India',
    accessibility: {
      alt: ['Sachin and Sakshi smiling', 'Lila at the beach', 'Sunset view']
    },
    views: 5000,
    likes: 100,
    hideLikes: true,
    commentsCount: 10,
    createdAt: new Date(),
  });

  // Reels
  const reelVideos = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  ];
  reelVideos.forEach((videoUrl, index) => {
    const user = dummyUsers[(index + 3) % dummyUsers.length];
    const comments = generateReelComments((index + 1) * 3);
    posts.push({
      id: `reel_${index + 1}`,
      type: 'reel',
      mediaUrls: [videoUrl],
      thumbnailUrl: `https://picsum.photos/seed/reel${index + 1}/400/700`,
      uploaderId: user.id,
      user: getHydratedUser(user.id),
      caption: `This is a cool reel #reel #${user.username}`,
      tags: ['reel', 'trending'],
      views: (index + 1) * 5432,
      likes: (index + 1) * 487,
      commentsCount: comments.length,
      createdAt: new Date(Date.now() - index * 12 * 60 * 60 * 1000),
      comments: comments
    });
  });

  // Videos
  const longFormVideos = [
    { id: 'vid_1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', title: 'How to build a Next.js app in 10 minutes', category: 'Tech' },
    { id: 'vid_2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'The Secret to Perfect Sourdough', category: 'Food' },
    { id: 'vid_3', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'My Desk Setup Tour 2024', category: 'Tech' },
    { id: 'vid_4', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', title: 'Beginner\'s Guide to Astrophotography', category: 'Science' },
    { id: 'vid_5', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', title: 'A Cinematic Journey Through Japan', category: 'Travel' },
    { id: 'vid_6', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', title: 'My Favorite Watercolor Techniques', category: 'Art' },
    { id: 'vid_7', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', title: 'Daily Workout Routine for Max Gains', category: 'Fitness' },
    { id: 'vid_8', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', title: 'Cricket Masterclass: The Cover Drive', category: 'Sports' },
  ];
  longFormVideos.forEach((vid, index) => {
    const user = dummyUsers[(index + 5) % dummyUsers.length];
    posts.push({
      id: vid.id,
      type: 'video',
      mediaUrls: [vid.url],
      thumbnailUrl: `https://picsum.photos/seed/${vid.id}/640/360`,
      uploaderId: user.id,
      user: getHydratedUser(user.id),
      caption: vid.title,
      category: vid.category.toLowerCase(),
      tags: [vid.category.toLowerCase(), 'longform'],
      views: (index + 1) * 123456,
      likes: (index + 1) * 5432,
      commentsCount: (index + 1) * 210,
      createdAt: new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000),
    });
  });

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
=======
    const user = dummyUsers.find(u => u.id === userId)!;
    return {
        ...user,
        avatarUrl: `https://picsum.photos/seed/${userId}/100/100`
    }
};

const generateReelComments = (count: number): ReelComment[] => {
    return Array.from({length: count}).map((_, i) => {
        const user = dummyUsers[i % dummyUsers.length];
        return {
            id: `comment-${Date.now()}-${i}`,
            user: user.username,
            profilePic: `https://picsum.photos/seed/${user.id}/100`,
            text: `This is a fantastic reel! Great job! #${i+1}`,
            likes: (i * 13 + 5),
            timeAgo: `${(i * 3 + 1)}m`,
            isLiked: (i % 5) === 0
        }
    })
}

const createDummyPosts = (): Post[] => {
    const posts: Post[] = [];
    
    // Photos
    PlaceHolderImages.forEach((img, index) => {
        const user = dummyUsers[index % dummyUsers.length];
        posts.push({
            id: `photo_${img.id}`,
            type: 'photo',
            mediaUrl: img.imageUrl,
            thumbnailUrl: img.imageUrl,
            uploaderId: user.id,
            user: getHydratedUser(user.id),
            caption: img.description,
            tags: ['photography', img.imageHint.split(' ')[0]],
            views: (index + 1) * 1234,
            likes: (index + 1) * 243,
            commentsCount: (index + 1) * 37,
            createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        });
    });

    // Reels
    const reelVideos = [
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    ];
    reelVideos.forEach((videoUrl, index) => {
        const user = dummyUsers[(index + 3) % dummyUsers.length];
        const comments = generateReelComments((index + 1) * 3);
        posts.push({
            id: `reel_${index + 1}`,
            type: 'reel',
            mediaUrl: videoUrl,
            thumbnailUrl: `https://picsum.photos/seed/reel${index + 1}/400/700`,
            uploaderId: user.id,
            user: getHydratedUser(user.id),
            caption: `This is a cool reel #reel #${user.username}`,
            tags: ['reel', 'trending'],
            views: (index + 1) * 5432,
            likes: (index + 1) * 487,
            commentsCount: comments.length,
            createdAt: new Date(Date.now() - index * 12 * 60 * 60 * 1000),
            comments: comments
        });
    });
    
    // Videos
     const longFormVideos = [
        { id: 'vid_1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', title: 'How to build a Next.js app in 10 minutes', category: 'Tech' },
        { id: 'vid_2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'The Secret to Perfect Sourdough', category: 'Food' },
        { id: 'vid_3', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'My Desk Setup Tour 2024', category: 'Tech' },
        { id: 'vid_4', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', title: 'Beginner\'s Guide to Astrophotography', category: 'Science' },
        { id: 'vid_5', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', title: 'A Cinematic Journey Through Japan', category: 'Travel' },
        { id: 'vid_6', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', title: 'My Favorite Watercolor Techniques', category: 'Art' },
        { id: 'vid_7', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', title: 'Daily Workout Routine for Max Gains', category: 'Fitness' },
        { id: 'vid_8', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', title: 'Cricket Masterclass: The Cover Drive', category: 'Sports' },
    ];
    longFormVideos.forEach((vid, index) => {
        const user = dummyUsers[(index + 5) % dummyUsers.length];
        posts.push({
            id: vid.id,
            type: 'video',
            mediaUrl: vid.url,
            thumbnailUrl: `https://picsum.photos/seed/${vid.id}/640/360`,
            uploaderId: user.id,
            user: getHydratedUser(user.id),
            caption: vid.title,
            tags: [vid.category.toLowerCase(), 'longform'],
            views: (index + 1) * 123456,
            likes: (index + 1) * 5432,
            commentsCount: (index + 1) * 210,
            createdAt: new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000),
        });
    });

    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
};

export const dummyPosts = createDummyPosts();

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
      timestamp: new Date(Date.now() - (10 - index) * 60000 * (index + 1)), // Use index to vary time
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
<<<<<<< HEAD
  { id: 'just-chatting', name: 'Just Chatting', thumbnailUrl: 'https://picsum.photos/seed/cat_chat/300/400' },
  { id: 'games', name: 'Games', thumbnailUrl: 'https://picsum.photos/seed/cat_games/300/400' },
  { id: 'music', name: 'Music', thumbnailUrl: 'https://picsum.photos/seed/cat_music/300/400' },
  { id: 'art', name: 'Art', thumbnailUrl: 'https://picsum.photos/seed/cat_art/300/400' },
  { id: 'tech', name: 'Tech', thumbnailUrl: 'https://picsum.photos/seed/cat_tech/300/400' },
  { id: 'sports', name: 'Sports', thumbnailUrl: 'https://picsum.photos/seed/cat_sports/300/400' },
  { id: 'travel', name: 'Travel', thumbnailUrl: 'https://picsum.photos/seed/cat_travel/300/400' },
  { id: 'food', name: 'Food', thumbnailUrl: 'https://picsum.photos/seed/cat_food/300/400' },
];

export let dummyLiveBroadcasts: LiveBroadcast[] = [
  { id: 'live_sachin', liveId: 'live_sachin', streamerId: 'user_sachin', streamerName: 'sachin', user: getHydratedUser('user_sachin'), title: 'Cricket Practice Session', category: 'Sports', isLive: true, viewerCount: 75000, liveThumbnail: 'https://picsum.photos/seed/stream_sachin/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: 'live_sakshi', liveId: 'live_sakshi', streamerId: 'user_sakshi', streamerName: 'sakshi', user: getHydratedUser('user_sakshi'), title: 'Morning Workout & Q&A', category: 'Fitness', isLive: true, viewerCount: 52000, liveThumbnail: 'https://picsum.photos/seed/stream_sakshi/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 'live_lila', liveId: 'live_lila', streamerId: 'user_wanderlust_lila', streamerName: 'wanderlust_lila', user: getHydratedUser('user_wanderlust_lila'), title: 'Exploring the streets of Tokyo', category: 'Travel', isLive: true, viewerCount: 8900, liveThumbnail: 'https://picsum.photos/seed/stream_lila/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: 'live_ethan', liveId: 'live_ethan', streamerId: 'user_ethan_bytes', streamerName: 'ethan_bytes', user: getHydratedUser('user_ethan_bytes'), title: 'Building a Rust project from scratch', category: 'Tech', isLive: true, viewerCount: 1200, liveThumbnail: 'https://picsum.photos/seed/stream_ethan/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 'live_maya', liveId: 'live_maya', streamerId: 'user_maya_creates', streamerName: 'maya_creates', user: getHydratedUser('user_maya_creates'), title: 'Live Painting Session: Cityscape', category: 'Art', isLive: true, viewerCount: 9800, liveThumbnail: 'https://picsum.photos/seed/stream_maya/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
  { id: 'live_sam', liveId: 'live_sam', streamerId: 'user_sam_reviews', streamerName: 'sam_reviews', user: getHydratedUser('user_sam_reviews'), title: 'Unboxing the new SuperPhone!', category: 'Tech', isLive: false, viewerCount: 0, liveThumbnail: 'https://picsum.photos/seed/stream_sam/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 'live_leo', liveId: 'live_leo', streamerId: 'user_leo_the_lion', streamerName: 'leo_the_lion', user: getHydratedUser('user_leo_the_lion'), title: 'Philosophy talk: Stoicism in 2024', category: 'Just Chatting', isLive: true, viewerCount: 450, liveThumbnail: 'https://picsum.photos/seed/stream_leo/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: 'live_javier', liveId: 'live_javier', streamerId: 'user_urban_eats', streamerName: 'urban_eats', user: getHydratedUser('user_urban_eats'), title: 'Taco Tuesday Live Mukbang!', category: 'Food', isLive: true, viewerCount: 3200, liveThumbnail: 'https://picsum.photos/seed/stream_javier/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  { id: 'live_chloe', liveId: 'live_chloe', streamerId: 'user_chloe_films', streamerName: 'chloe_films', user: getHydratedUser('user_chloe_films'), title: 'Color Grading a Short Film in DaVinci', category: 'Art', isLive: true, viewerCount: 6700, liveThumbnail: 'https://picsum.photos/seed/stream_chloe/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 'live_aris', liveId: 'live_aris', streamerId: 'user_astro_gaze', streamerName: 'astro_gaze', user: getHydratedUser('user_astro_gaze'), title: 'Stargazing: Looking at Jupiter', category: 'Science', isLive: true, viewerCount: 950, liveThumbnail: 'https://picsum.photos/seed/stream_aris/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
=======
    { id: 'just-chatting', name: 'Just Chatting', thumbnailUrl: 'https://picsum.photos/seed/cat_chat/300/400' },
    { id: 'games', name: 'Games', thumbnailUrl: 'https://picsum.photos/seed/cat_games/300/400' },
    { id: 'music', name: 'Music', thumbnailUrl: 'https://picsum.photos/seed/cat_music/300/400' },
    { id: 'art', name: 'Art', thumbnailUrl: 'https://picsum.photos/seed/cat_art/300/400' },
    { id: 'tech', name: 'Tech', thumbnailUrl: 'https://picsum.photos/seed/cat_tech/300/400' },
    { id: 'sports', name: 'Sports', thumbnailUrl: 'https://picsum.photos/seed/cat_sports/300/400' },
    { id: 'travel', name: 'Travel', thumbnailUrl: 'https://picsum.photos/seed/cat_travel/300/400' },
    { id: 'food', name: 'Food', thumbnailUrl: 'https://picsum.photos/seed/cat_food/300/400' },
];

export let dummyLiveBroadcasts: LiveBroadcast[] = [
    { id: 'live_sachin', liveId: 'live_sachin', streamerId: 'user_sachin', streamerName: 'sachin', user: getHydratedUser('user_sachin'), title: 'Cricket Practice Session', category: 'Sports', isLive: true, viewerCount: 75000, liveThumbnail: 'https://picsum.photos/seed/stream_sachin/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 'live_sakshi', liveId: 'live_sakshi', streamerId: 'user_sakshi', streamerName: 'sakshi', user: getHydratedUser('user_sakshi'), title: 'Morning Workout & Q&A', category: 'Fitness', isLive: true, viewerCount: 52000, liveThumbnail: 'https://picsum.photos/seed/stream_sakshi/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    { id: 'live_lila', liveId: 'live_lila', streamerId: 'user_wanderlust_lila', streamerName: 'wanderlust_lila', user: getHydratedUser('user_wanderlust_lila'), title: 'Exploring the streets of Tokyo', category: 'Travel', isLive: true, viewerCount: 8900, liveThumbnail: 'https://picsum.photos/seed/stream_lila/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { id: 'live_ethan', liveId: 'live_ethan', streamerId: 'user_ethan_bytes', streamerName: 'ethan_bytes', user: getHydratedUser('user_ethan_bytes'), title: 'Building a Rust project from scratch', category: 'Tech', isLive: true, viewerCount: 1200, liveThumbnail: 'https://picsum.photos/seed/stream_ethan/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { id: 'live_maya', liveId: 'live_maya', streamerId: 'user_maya_creates', streamerName: 'maya_creates', user: getHydratedUser('user_maya_creates'), title: 'Live Painting Session: Cityscape', category: 'Art', isLive: true, viewerCount: 9800, liveThumbnail: 'https://picsum.photos/seed/stream_maya/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
    { id: 'live_sam', liveId: 'live_sam', streamerId: 'user_sam_reviews', streamerName: 'sam_reviews', user: getHydratedUser('user_sam_reviews'), title: 'Unboxing the new SuperPhone!', category: 'Tech', isLive: false, viewerCount: 0, liveThumbnail: 'https://picsum.photos/seed/stream_sam/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { id: 'live_leo', liveId: 'live_leo', streamerId: 'user_leo_the_lion', streamerName: 'leo_the_lion', user: getHydratedUser('user_leo_the_lion'), title: 'Philosophy talk: Stoicism in 2024', category: 'Just Chatting', isLive: true, viewerCount: 450, liveThumbnail: 'https://picsum.photos/seed/stream_leo/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
    { id: 'live_javier', liveId: 'live_javier', streamerId: 'user_urban_eats', streamerName: 'urban_eats', user: getHydratedUser('user_urban_eats'), title: 'Taco Tuesday Live Mukbang!', category: 'Food', isLive: true, viewerCount: 3200, liveThumbnail: 'https://picsum.photos/seed/stream_javier/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
    { id: 'live_chloe', liveId: 'live_chloe', streamerId: 'user_chloe_films', streamerName: 'chloe_films', user: getHydratedUser('user_chloe_films'), title: 'Color Grading a Short Film in DaVinci', category: 'Art', isLive: true, viewerCount: 6700, liveThumbnail: 'https://picsum.photos/seed/stream_chloe/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    { id: 'live_aris', liveId: 'live_aris', streamerId: 'user_astro_gaze', streamerName: 'astro_gaze', user: getHydratedUser('user_astro_gaze'), title: 'Stargazing: Looking at Jupiter', category: 'Science', isLive: true, viewerCount: 950, liveThumbnail: 'https://picsum.photos/seed/stream_aris/640/360', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
];

// Add a function to get initial chat messages for a stream
export const getInitialChatMessages = (streamerName: string): LiveChatMessage[] => {
<<<<<<< HEAD
  return [
    { id: 'msg1', userId: 'user_sachin', username: 'sachin', text: `Welcome to the stream, everyone!`, timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 'msg2', userId: 'user_sakshi', username: 'sakshi', text: `Let's go, ${streamerName}!`, timestamp: new Date(Date.now() - 4 * 60000) },
    { id: 'msg3', userId: 'user_leo_the_lion', username: 'leo_the_lion', text: 'This is going to be great.', timestamp: new Date(Date.now() - 3 * 60000) },
  ]
=======
    return [
        { id: 'msg1', userId: 'user_sachin', username: 'sachin', text: `Welcome to the stream, everyone!`, timestamp: new Date(Date.now() - 5 * 60000) },
        { id: 'msg2', userId: 'user_sakshi', username: 'sakshi', text: `Let's go, ${streamerName}!`, timestamp: new Date(Date.now() - 4 * 60000) },
        { id: 'msg3', userId: 'user_leo_the_lion', username: 'leo_the_lion', text: 'This is going to be great.', timestamp: new Date(Date.now() - 3 * 60000) },
    ]
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
}
