
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Post } from '@/lib/types';
import { getHydratedUser } from '@/lib/dummy-data';

const REELS_PER_PAGE = 9;

interface UseReelsResult {
  reels: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
}

export function useReels(userId: string): UseReelsResult {
  const firestore = useFirestore();
  const [reels, setReels] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReels = useCallback(async (lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
    if (!userId) return;

    if (lastVisibleDoc === null) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
        const reelsRef = collection(firestore, 'reels');
        let q = query(
            reelsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(REELS_PER_PAGE)
        );

        if (lastVisibleDoc) {
            q = query(q, startAfter(lastVisibleDoc));
        }

        const querySnapshot = await getDocs(q);
        const newReels = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<Post, 'user' | 'type' | 'uploaderId'> & { userId: string };
            return {
                ...data,
                id: doc.id,
                type: 'reel',
                uploaderId: data.userId, // Maintain uploaderId for consistency
                user: getHydratedUser(data.userId)
            } as Post;
        });

      setReels(prev => lastVisibleDoc ? [...prev, ...newReels] : newReels);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === REELS_PER_PAGE);

    } catch (e) {
      console.error("Error fetching reels:", e);
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [firestore, userId]);
  
  useEffect(() => {
    setReels([]);
    setLastDoc(null);
    setHasMore(true);
    fetchReels();
  }, [fetchReels]);


  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && lastDoc) {
      fetchReels(lastDoc);
    }
  }, [isLoading, isLoadingMore, hasMore, lastDoc, fetchReels]);

  return { reels, isLoading, isLoadingMore, hasMore, error, loadMore };
}
