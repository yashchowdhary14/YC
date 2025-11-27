
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
  // This function is currently not used when the app is in full dummy data mode.
  // It's kept for potential future use when re-connecting to Firestore.
}
