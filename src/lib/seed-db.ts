
import { collection, writeBatch, doc, Firestore } from "firebase/firestore";
import { dummyUsers, dummyLiveBroadcasts as dummyBroadcastsData } from "./dummy-data";
import { LiveBroadcast, Category, Post } from "./types";

// This function now just transforms the imported dummy data
const streamsToSeed = (): Omit<LiveBroadcast, 'id' | 'user' >[] => {
  return dummyBroadcastsData.map(stream => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { liveId, user, avatarUrl, ...rest } = stream;
    return rest;
  });
};


const dummyCategories: Category[] = [
    { id: 'just-chatting', name: 'Just Chatting', thumbnailUrl: 'https://picsum.photos/seed/cat_chat/300/400' },
    { id: 'games', name: 'Games', thumbnailUrl: 'https://picsum.photos/seed/cat_games/300/400' },
    { id: 'music', name: 'Music', thumbnailUrl: 'https://picsum.photos/seed/cat_music/300/400' },
    { id: 'art', name: 'Art', thumbnailUrl: 'https://picsum.photos/seed/cat_art/300/400' },
    { id: 'tech', name: 'Tech', thumbnailUrl: 'https://picsum.photos/seed/cat_tech/300/400' },
    { id: 'sports', name: 'Sports', thumbnailUrl: 'https://picsum.photos/seed/cat_sports/300/400' },
    { id: 'travel', name: 'Travel', thumbnailUrl: 'https://picsum.photos/seed/cat_travel/300/400' },
    { id: 'food', name: 'Food', thumbnailUrl: 'https://picsum.photos/seed/cat_food/300/400' },
];

export async function seedDatabase(db: Firestore) {
  if(!db) {
    console.error("Firestore instance is not available. Skipping seeding.");
    return;
  }
  const batch = writeBatch(db);

  // Seed Streams
  const streamsCol = collection(db, "streams");
  streamsToSeed().forEach((streamData) => {
    const user = dummyUsers.find(u => u.id === streamData.streamerId);
    if (!user) return;
    
    const streamDoc: Omit<LiveBroadcast, 'id'> = {
      ...streamData,
      user: {
          id: user.id,
          username: user.username,
          avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`,
          fullName: user.fullName,
          bio: user.bio,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          verified: user.verified
      }
    };
    const docRef = doc(streamsCol, streamData.streamerId);
    batch.set(docRef, streamDoc);
  });

  // Seed Categories
  const categoriesCol = collection(db, "categories");
  dummyCategories.forEach((category) => {
    const docRef = doc(categoriesCol, category.id);
    batch.set(docRef, category);
  });
  
  // Seed Users
  const usersCol = collection(db, "users");
  dummyUsers.forEach((user) => {
    const docRef = doc(usersCol, user.id);
    batch.set(docRef, user);
  });

  try {
    await batch.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
