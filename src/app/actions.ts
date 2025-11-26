
'use server';

import { generateAiCaption } from '@/ai/flows/generate-ai-caption';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, runTransaction, arrayUnion, arrayRemove, increment, writeBatch, deleteDoc, getDoc, query, where, getDocs, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';

export async function handleCaptionGeneration(mediaDataUri: string) {
  try {
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
        const imageRef = ref(storage, `posts/${userId}/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);

        await runTransaction(firestore, async (transaction) => {
            const postsCollectionRef = collection(firestore, 'posts');
            const newPostRef = doc(postsCollectionRef); 

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
            
            transaction.set(newPostRef, newPost);

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
  const userPostRef = doc(firestore, 'users', userId, 'posts', postId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw "Document does not exist!";
      }

      const postData = postDoc.data();
      const likes: string[] = postData.likes || [];
      
      const isLiked = likes.includes(userId);
      let newLikes: string[];
      
      if (isLiked) {
        newLikes = likes.filter(id => id !== userId);
        transaction.update(postRef, { likes: arrayRemove(userId) });
        transaction.update(userPostRef, { likes: arrayRemove(userId) });
      } else {
        newLikes = [...likes, userId];
        transaction.update(postRef, { likes: arrayUnion(userId) });
        transaction.update(userPostRef, { likes: arrayUnion(userId) });
      }
    });

    revalidatePath('/');
    revalidatePath(`/p/${postId}`);
    revalidatePath('/profile');
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

    await runTransaction(firestore, async (transaction) => {
      const newCommentRef = doc(commentsRef);
      transaction.set(newCommentRef, { ...newComment, id: newCommentRef.id });
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

    const followingRef = doc(firestore, 'users', currentUserId, 'following', targetUserId);
    batch.set(followingRef, { userId: targetUserId, followedAt: serverTimestamp() });

    const followerRef = doc(firestore, 'users', targetUserId, 'followers', currentUserId);
    batch.set(followerRef, { userId: currentUserId, followedAt: serverTimestamp() });

    const currentUserRef = doc(firestore, 'users', currentUserId);
    batch.update(currentUserRef, { followingCount: increment(1) });

    const targetUserRef = doc(firestore, 'users', targetUserId);
    batch.update(targetUserRef, { followersCount: increment(1) });

    try {
        await batch.commit();
        revalidatePath('/');
        revalidatePath('/profile');
        revalidatePath(`/${targetUserId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error following user:", error);
        return { success: false, error: error.message || "Could not follow user." };
    }
}


export async function unfollowUser(currentUserId: string, targetUserId: string) {
    const { firestore } = initializeFirebase();
    const batch = writeBatch(firestore);

    const followingRef = doc(firestore, 'users', currentUserId, 'following', targetUserId);
    batch.delete(followingRef);

    const followerRef = doc(firestore, 'users', targetUserId, 'followers', currentUserId);
    batch.delete(followerRef);

    const currentUserRef = doc(firestore, 'users', currentUserId);
    batch.update(currentUserRef, { followingCount: increment(-1) });

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
        let mediaUrl: string | undefined = undefined;

        if (imageFile && imageFile.size > 0) {
            const imageRef = ref(storage, `chats/${chatId}/${Date.now()}_${imageFile.name}`);
            const uploadResult = await uploadBytes(imageRef, imageFile);
            mediaUrl = await getDownloadURL(uploadResult.ref);
        }

        const messagesCollectionRef = collection(firestore, 'chats', chatId, 'messages');
        const newMessage = {
            chatId,
            senderId,
            text: text || '',
            mediaUrl: mediaUrl,
            mediaType: mediaUrl ? 'image' : undefined,
            timestamp: serverTimestamp(),
            isRead: false,
        };

        const chatRef = doc(firestore, 'chats', chatId);
        
        await runTransaction(firestore, async (transaction) => {
            const newDocRef = doc(messagesCollectionRef);
            transaction.set(newDocRef, { ...newMessage, id: newDocRef.id });
            
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
        revalidatePath(`/chat/${chatId}`);
        return { success: true };

    } catch (error: any) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message || 'Failed to send message.' };
    }
}


export async function createOrGetChat(user1Id: string, user2Id: string) {
    if (user1Id === user2Id) {
        return { success: false, error: "Cannot create chat with oneself." };
    }
    const { firestore } = initializeFirebase();
    const sortedIds = [user1Id, user2Id].sort();
    const chatId = sortedIds.join('_');
    const chatRef = doc(firestore, 'chats', chatId);

    try {
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
             // Create the chat document first in its own transaction
            await setDoc(chatRef, {
                id: chatId,
                users: sortedIds,
                lastUpdated: serverTimestamp(),
                lastMessage: null,
            });
        }
        
        return { success: true, chatId: chatId };
    } catch (error: any) {
        console.error('Error creating or getting chat:', error);
        return { success: false, error: error.message || 'Failed to create or get chat.' };
    }
}
