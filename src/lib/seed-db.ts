
import { collection, writeBatch, doc, Firestore } from "firebase/firestore";
import { dummyCategories, dummyUsers, dummyVideos } from "./dummy-data";
import { Stream } from "./types";

// This is a simplified version of the dummyStreams data for seeding purposes
const streamsToSeed = [
    { id: 'user_sachin', streamerId: 'user_sachin', title: 'Cricket Practice', category: 'Sports', tags: ['Cricket', 'Training'], isLive: true, viewerCount: 75000 },
    { id: 'user_sakshi', streamerId: 'user_sakshi', title: 'Workout Session', category: 'Fitness', tags: ['Wrestling', 'Training'], isLive: true, viewerCount: 52000 },
    { id: 'user_wanderlust_lila', streamerId: 'user_wanderlust_lila', title: 'Exploring Tokyo', category: 'Travel', tags: ['Japan', 'Vlog'], isLive: false, viewerCount: 0 },
    { id: 'user_ethan_bytes', streamerId: 'user_ethan_bytes', title: 'Coding a new project', category: 'Tech', tags: ['Programming', 'Rust'], isLive: true, viewerCount: 1200 },
    { id: 'user_maya_creates', streamerId: 'user_maya_creates', title: 'Live Painting Session', category: 'Art', tags: ['Illustration', 'Creative'], isLive: true, viewerCount: 9800 },
    { id: 'user_sam_reviews', streamerId: 'user_sam_reviews', title: 'Unboxing the new phone!', category: 'Tech', tags: ['Unboxing', 'Gadgets'], isLive: false, viewerCount: 0 },
];


export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Seed Streams
  const streamsCol = collection(db, "streams");
  streamsToSeed.forEach((streamData) => {
    const user = dummyUsers.find(u => u.id === streamData.streamerId);
    if (!user) return;
    
    const streamDoc: Omit<Stream, 'id'> = {
      streamerId: user.id,
      title: streamData.title,
      category: streamData.category,
      tags: streamData.tags,
      viewerCount: streamData.viewerCount,
      isLive: streamData.isLive,
      thumbnailUrl: `https://picsum.photos/seed/${streamData.id}/640/360`,
      user: { // Nest the user object
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
    const docRef = doc(streamsCol, streamData.id);
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

  // Seed Videos
  const videosCol = collection(db, "videos");
  dummyVideos.forEach((video) => {
      const docRef = doc(videosCol, video.id);
      batch.set(docRef, video);
  });

  await batch.commit();
  console.log("Database seeded successfully!");
}

    