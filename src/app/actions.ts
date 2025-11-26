
'use server';

import { generateAiCaption } from '@/ai/flows/generate-ai-caption';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, runTransaction, arrayUnion, arrayRemove, increment, writeBatch, deleteDoc } from 'firebase/firestore';
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
    const altText = formData.get('altText') as string;
    const hideLikes = formData.get('hideLikes') === 'true';
    const commentsOff = formData.get('commentsOff') === 'true';

    if (!imageFile || !userId) {
        return { success: false, error: 'Image and user ID are required.' };
    }

    try {
        // 1. Upload image to Firebase Storage
        const imageRef = ref(storage, `posts/${userId}/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);

        // 2. Create post document in a transaction
        await runTransaction(firestore, async (transaction) => {
            const postsCollectionRef = collection(firestore, 'posts');
            const newPostRef = doc(postsCollectionRef); // Create a new ref with a new ID

            const newPost = {
                id: newPostRef.id,
                userId,
                caption,
                location,
                imageUrl,
                altText,
                hideLikes,
                commentsOff,
                likes: [],
                commentsCount: 0,
                createdAt: serverTimestamp(),
            };
            
            // 3. Add post to the top-level 'posts' collection
            transaction.set(newPostRef, newPost);

            // 4. (Optional) Add post to the user's specific 'posts' subcollection
            const userPostsCollectionRef = collection(firestore, 'users', userId, 'posts');
            const userPostRef = doc(userPostsCollectionRef, newPostRef.id);
            transaction.set(userPostRef, newPost);
        });

        revalidatePath('/');
        revalidatePath('/profile');
        return { success: true };

    } catch (error: any) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message || 'Failed to create post due to a server error.' };
    }
}


export async function toggleLike(postId: string, userId: string) {
  const { firestore } = initializeFirebase();
  const postRef = doc(firestore, 'posts', postId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw "Document does not exist!";
      }

      const postData = postDoc.data();
      const likes: string[] = postData.likes || [];
      
      const isLiked = likes.includes(userId);

      if (isLiked) {
        // User has already liked the post, so we unlike it.
        transaction.update(postRef, {
          likes: arrayRemove(userId)
        });
      } else {
        // User has not liked the post, so we like it.
        transaction.update(postRef, {
          likes: arrayUnion(userId)
        });
      }
    });

    revalidatePath('/');
    revalidatePath(`/p/${postId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message || 'Failed to update like status.' };
  }
}

export async function addComment(postId: string, userId: string, text: string) {
  const { firestore } = initializeFirebase();
  const commentsRef = collection(firestore, 'comments');
  const postRef = doc(firestore, 'posts', postId);

  if (!text.trim()) {
    return { success: false, error: 'Comment cannot be empty.' };
  }

  try {
    const newComment = {
      parentId: postId,
      userId,
      text,
      createdAt: serverTimestamp(),
    };

    // Add the comment and update the post's comment count in a transaction
    await runTransaction(firestore, async (transaction) => {
      // 1. Add the new comment
      const newCommentRef = doc(commentsRef); // Create a new ref with a new ID
      transaction.set(newCommentRef, { ...newComment, id: newCommentRef.id });

      // 2. Increment the commentsCount on the post
      transaction.update(postRef, {
        commentsCount: increment(1),
      });
    });
    
    revalidatePath(`/p/${postId}`);
    return { success: true };

  } catch (error: any) {
    console.error("Error adding comment:", error);
    return { success: false, error: error.message || "Could not post comment." };
  }
}


export async function followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
        return { success: false, error: 'Users cannot follow themselves.' };
    }
    const { firestore } = initializeFirebase();
    const batch = writeBatch(firestore);

    // 1. Add target user to current user's 'following' subcollection
    const followingRef = doc(firestore, 'users', currentUserId, 'following', targetUserId);
    batch.set(followingRef, { userId: targetUserId, followedAt: serverTimestamp() });

    // 2. Add current user to target user's 'followers' subcollection
    const followerRef = doc(firestore, 'users', targetUserId, 'followers', currentUserId);
    batch.set(followerRef, { userId: currentUserId, followedAt: serverTimestamp() });

    // 3. Increment current user's 'followingCount'
    const currentUserRef = doc(firestore, 'users', currentUserId);
    batch.update(currentUserRef, { followingCount: increment(1) });

    // 4. Increment target user's 'followersCount'
    const targetUserRef = doc(firestore, 'users', targetUserId);
    batch.update(targetUserRef, { followersCount: increment(1) });

    try {
        await batch.commit();
        revalidatePath('/');
        revalidatePath('/profile');
        revalidatePath(`/${targetUserId}`); // Assuming a dynamic profile page route
        return { success: true };
    } catch (error: any) {
        console.error("Error following user:", error);
        return { success: false, error: error.message || "Could not follow user." };
    }
}


export async function unfollowUser(currentUserId: string, targetUserId: string) {
    const { firestore } = initializeFirebase();
    const batch = writeBatch(firestore);

    // 1. Remove target user from current user's 'following' subcollection
    const followingRef = doc(firestore, 'users', currentUserId, 'following', targetUserId);
    batch.delete(followingRef);

    // 2. Remove current user from target user's 'followers' subcollection
    const followerRef = doc(firestore, 'users', targetUserId, 'followers', currentUserId);
    batch.delete(followerRef);

    // 3. Decrement current user's 'followingCount'
    const currentUserRef = doc(firestore, 'users', currentUserId);
    batch.update(currentUserRef, { followingCount: increment(-1) });

    // 4. Decrement target user's 'followersCount'
    const targetUserRef = doc(firestore, 'users', targetUserId);
    batch.update(targetUserRef, { followersCount: increment(-1) });

    try {
        await batch.commit();
        revalidatePath('/');
        revalidatePath('/profile');
        revalidatePath(`/${targetUserId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error unfollowing user:", error);
        return { success: false, error: error.message || "Could not unfollow user." };
    }
}

export async function handleSendMessage(formData: FormData) {
    const { firestore, firebaseApp } = initializeFirebase();
    const storage = getStorage(firebaseApp);

    const chatId = formData.get('chatId') as string;
    const senderId = formData.get('senderId') as string;
    const text = formData.get('text') as string;
    const imageFile = formData.get('image') as File | null;

    if (!chatId || !senderId || (!text && !imageFile)) {
        return { success: false, error: 'Missing required fields.' };
    }
    
    try {
        let imageUrl: string | undefined = undefined;

        // 1. If there's an image, upload it to Firebase Storage first
        if (imageFile) {
            const imageRef = ref(storage, `chats/${chatId}/${Date.now()}_${imageFile.name}`);
            const uploadResult = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(uploadResult.ref);
        }

        // 2. Prepare the new message object
        const messagesCollectionRef = collection(firestore, 'chats', chatId, 'messages');
        const newMessage = {
            chatId,
            senderId,
            text: text || '',
            mediaUrl: imageUrl,
            mediaType: imageUrl ? 'image' : undefined,
            timestamp: serverTimestamp(),
            isRead: false,
        };

        // 3. Add the new message and update the chat's lastMessage in a transaction
        const chatRef = doc(firestore, 'chats', chatId);
        
        await runTransaction(firestore, async (transaction) => {
            const newDocRef = doc(messagesCollectionRef);
            transaction.set(newDocRef, { ...newMessage, id: newDocRef.id });
            
            // Update the last message on the parent chat document
            transaction.update(chatRef, {
                lastMessage: {
                    text: text || 'Image',
                    timestamp: serverTimestamp(),
                    senderId,
                },
                lastUpdated: serverTimestamp(),
            });
        });
        
        revalidatePath(`/messages`);
        return { success: true };

    } catch (error: any) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message || 'Failed to send message.' };
    }
}
