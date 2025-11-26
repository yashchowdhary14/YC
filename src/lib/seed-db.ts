
import { collection, writeBatch, doc, Firestore } from "firebase/firestore";
import { dummyStreams, dummyCategories, dummyUsers } from "./dummy-data";

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Seed Streams
  const streamsCol = collection(db, "streams");
  dummyStreams.forEach((streamData) => {
    // Associate a real user
    const user = dummyUsers.find(u => u.id === streamData.streamerId);
    if (!user) return;
    
    const streamDoc = {
      ...streamData,
      streamerName: user.username,
      avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`,
      // In a real app, you would get this from storage after uploading
      thumbnailUrl: `https://picsum.photos/seed/${streamData.id}/640/360`,
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

  await batch.commit();
  console.log("Database seeded successfully!");
}

    