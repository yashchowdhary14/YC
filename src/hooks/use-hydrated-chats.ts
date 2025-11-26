
'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, getDocs, collection, query, where, DocumentData } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import type { Chat as ChatType, User } from '@/lib/types';

// The raw chat type from Firestore
type RawChat = Omit<ChatType, 'userDetails'> & { users: string[] };

/**
 * A hook to efficiently fetch and hydrate chat data with associated user details.
 * It batches user data requests to avoid the N+1 query problem.
 *
 * @param chatsData An array of raw chat data from Firestore.
 * @returns An object containing the hydrated chats and a loading state.
 */
export function useHydratedChats(chatsData: (RawChat & { id: string })[] | null) {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const [hydratedChats, setHydratedChats] = useState<ChatType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const memoizedChatsData = useMemo(() => chatsData, [chatsData]);

  useEffect(() => {
    const hydrateChats = async () => {
      if (!memoizedChatsData || memoizedChatsData.length === 0 || !currentUser || !firestore) {
        setHydratedChats([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // 1. Collect all unique user IDs from all chats, excluding the current user
      const allUserIds = memoizedChatsData.flatMap(chat => chat.users);
      const uniqueUserIds = [...new Set(allUserIds)].filter(id => id !== currentUser.uid);

      // Create a map to store user data for quick lookups
      const usersMap = new Map<string, User>();

      try {
        // 2. Fetch all unique user profiles in batched queries
        if (uniqueUserIds.length > 0) {
          const MAX_IN_QUERY_SIZE = 30;
          const userIdChunks: string[][] = [];
          for (let i = 0; i < uniqueUserIds.length; i += MAX_IN_QUERY_SIZE) {
            userIdChunks.push(uniqueUserIds.slice(i, i + MAX_IN_QUERY_SIZE));
          }

          for (const chunk of userIdChunks) {
            if (chunk.length > 0) {
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
        }

        // 3. Map over chats and embed the fetched user data
        const newHydratedChats = memoizedChatsData.map(chat => {
          const userDetails = chat.users
            .map(userId => {
              // Add current user's data manually if they are part of the chat
              if (userId === currentUser.uid) {
                return {
                    id: currentUser.uid,
                    username: currentUser.email?.split('@')[0] || 'You',
                    fullName: currentUser.displayName || 'You',
                    avatarUrl: currentUser.photoURL || `https://picsum.photos/seed/${currentUser.uid}/100/100`
                }
              }
              return usersMap.get(userId);
            })
            .filter((user): user is User => user !== undefined); // Type guard to filter out undefined

          return {
            ...chat,
            userDetails,
          };
        });

        setHydratedChats(newHydratedChats);
      } catch (error) {
        console.error("Error hydrating chats:", error);
         const fallbackChats = memoizedChatsData.map(chat => ({
             ...chat,
            userDetails: []
        }))
        setHydratedChats(fallbackChats);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateChats();
  }, [memoizedChatsData, firestore, currentUser]);

  return { chats: hydratedChats, isLoading };
}
