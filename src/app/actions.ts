'use server';

import { generateAiCaption } from '@/ai/flows/generate-ai-caption';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';

export async function handleCaptionGeneration(mediaDataUri: string) {
  try {
    // In a real application, you would get user data and trending topics from your database.
    const result = await generateAiCaption({
      mediaDataUri,
      userProfile: {
        username: 'ycombinator_user',
        bio: 'Exploring the world of startups and technology. Passionate about innovation and building the future.',
        followers: ['user1', 'user2', 'user3'],
        following: ['user4', 'user5'],
      },
      trendingKeywords: ['techlife', 'innovation', 'futureoftech', 'startups', 'coding'],
    });
    return { caption: result.caption, error: null };
  } catch (e: any) {
    console.error('Error generating caption:', e);
    // Return a user-friendly error message.
    return { caption: null, error: e.message || 'Failed to generate caption. The AI model might be temporarily unavailable. Please try again later.' };
  }
}


export async function handleCreatePost(formData: FormData) {
    const { firestore, firebaseApp } = initializeFirebase();
    const storage = getStorage(firebaseApp);

    const imageFile = formData.get('image') as File;
    const caption = formData.get('caption') as string;
    const location = formData.get('location') as string;
    const userId = formData.get('userId') as string;

    if (!imageFile || !userId) {
        throw new Error('Image and user ID are required to create a post.');
    }

    try {
        // 1. Upload image to Firebase Storage
        const imageRef = ref(storage, `posts/${userId}/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);

        // 2. Create post document data
        const newPost = {
            userId,
            caption,
            location,
            imageUrl,
            likes: [],
            commentsCount: 0,
            createdAt: serverTimestamp(),
        };

        // 3. Add post to the top-level 'posts' collection
        const postsCollectionRef = collection(firestore, 'posts');
        const addedPost = await addDoc(postsCollectionRef, newPost);
        
        // Use the ID from the new doc to update it with its own ID
        const postDocRef = doc(firestore, 'posts', addedPost.id);
        await setDoc(postDocRef, { id: addedPost.id }, { merge: true });


        // 4. (Optional but good practice) Add post to the user's specific 'posts' subcollection
        const userPostsCollectionRef = collection(firestore, 'users', userId, 'posts');
        await setDoc(doc(userPostsCollectionRef, addedPost.id), { ...newPost, id: addedPost.id });

        revalidatePath('/');
        revalidatePath('/profile');
        return { success: true, postId: addedPost.id };

    } catch (error: any) {
        console.error('Error creating post:', error);
        throw new Error(error.message || 'Failed to create post due to a server error.');
    }
}

export async function toggleLike(postId: string, userId: string) {
  const { firestore } = initializeFirebase();
  const postRef = doc(firestore, 'posts', postId);
  const userPostRef = doc(firestore, 'users', userId, 'posts', postId);

  try {
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();
    const isLiked = postData.likes?.includes(userId);

    const mainUpdate = updateDoc(postRef, {
      likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    });

    // Also update the user's subcollection post if it exists
    const userPostUpdate = updateDoc(userPostRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    }).catch(err => console.log("User's own post copy not found, skipping update.")); // Don't block if this fails

    await Promise.all([mainUpdate, userPostUpdate]);
    
    revalidatePath('/');
    revalidatePath(`/p/${postId}`);
    revalidatePath('/profile');

    return { success: true, isLiked: !isLiked };
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
}
