'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, getDocs, collection, query, where, DocumentData, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Post as PostType, User } from '@/lib/types';

// The raw post type from Firestore, before user data is embedded
type RawPost = Omit<PostType, 'user' | 'createdAt'> & { userId: string, createdAt: Timestamp };

/**
 * A hook to efficiently fetch and hydrate post data with associated user data.
 * It batches user data requests to avoid the N+1 query problem.
 *
 * @param postsData An array of raw post data from Firestore.
 * @returns An object containing the hydrated posts and a loading state.
 */
export function useHydratedPosts(postsData: (RawPost & { id: string })[] | null) {
  const firestore = useFirestore();
  const [hydratedPosts, setHydratedPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the raw posts data to prevent unnecessary re-fetches
  const memoizedPostsData = useMemo(() => postsData, [postsData]);

  useEffect(() => {
    const hydratePosts = async () => {
      if (!memoizedPostsData || memoizedPostsData.length === 0) {
        setHydratedPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // 1. Collect all unique user IDs from the posts
      const userIds = [...new Set(memoizedPostsData.map(post => post.userId))];
      
      // Create a map to store user data for quick lookups
      const usersMap = new Map<string, User>();

      try {
         // 2. Fetch all unique users in a single batched query if possible
        if (userIds.length > 0) {
            // Firestore's 'in' query is limited to 30 items per query.
            // We need to chunk the userIds array to handle more than 30 users.
            const MAX_IN_QUERY_SIZE = 30;
            const userIdChunks: string[][] = [];
            for (let i = 0; i < userIds.length; i += MAX_IN_QUERY_SIZE) {
                userIdChunks.push(userIds.slice(i, i + MAX_IN_QUERY_SIZE));
            }

            // Execute a query for each chunk
            for (const chunk of userIdChunks) {
                const usersQuery = query(collection(firestore, 'users'), where('id', 'in', chunk));
                const userSnapshots = await getDocs(usersQuery);
                userSnapshots.forEach(userDoc => {
                    const userData = userDoc.data() as DocumentData;
                    usersMap.set(userDoc.id, {
                        id: userDoc.id,
                        username: userData.username || 'unknown',
                        fullName: userData.fullName || 'Unknown User',
                        avatarUrl: userData.profilePhoto || `https://picsum.photos/seed/${userDoc.id}/100/100`,
                    });
                });
            }
        }


        // 3. Map over posts and embed the fetched user data
        const newHydratedPosts = memoizedPostsData.map(post => {
          const user = usersMap.get(post.userId) || {
            id: post.userId,
            username: 'loading...',
            fullName: 'loading...',
            avatarUrl: `https://picsum.photos/seed/${post.userId}/100/100`,
          };

          return {
            ...post,
            id: post.id,
            createdAt: post.createdAt?.toDate ? post.createdAt.toDate() : new Date(),
            user,
          };
        });

        setHydratedPosts(newHydratedPosts);
      } catch (error) {
        console.error("Error hydrating posts:", error);
        // Fallback to un-hydrated data if user fetching fails
        const fallbackPosts = memoizedPostsData.map(post => ({
             ...post,
            id: post.id,
            createdAt: post.createdAt?.toDate ? post.createdAt.toDate() : new Date(),
            user: {
                id: post.userId,
                username: 'error',
                fullName: 'Error',
                avatarUrl: `https://picsum.photos/seed/${post.userId}/100/100`,
            }
        }))
        setHydratedPosts(fallbackPosts)
      } finally {
        setIsLoading(false);
      }
    };

    hydratePosts();
  }, [memoizedPostsData, firestore]);

  return { posts: hydratedPosts, isLoading };
}
