
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

const POSTS_PER_PAGE = 12;

interface UseTaggedPostsResult {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
}

export function useTaggedPosts(userId: string): UseTaggedPostsResult {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTaggedPosts = useCallback(async (lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
    if (!userId) return;

    if (lastVisibleDoc === null) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
        const postsRef = collection(firestore, 'posts');
        let q = query(
            postsRef,
            where('taggedUsers', 'array-contains', userId),
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
        );

        if (lastVisibleDoc) {
            q = query(q, startAfter(lastVisibleDoc));
        }

        const querySnapshot = await getDocs(q);
        const newPosts = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<Post, 'user'>;
            return {
                ...data,
                id: doc.id,
                user: getHydratedUser(data.uploaderId)
            } as Post;
        });

      setPosts(prev => lastVisibleDoc ? [...prev, ...newPosts] : newPosts);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE);

    } catch (e) {
      console.error("Error fetching tagged posts:", e);
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [firestore, userId]);
  
  // Initial fetch
  useEffect(() => {
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    fetchTaggedPosts();
  }, [fetchTaggedPosts, userId]);


  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && lastDoc) {
      fetchTaggedPosts(lastDoc);
    }
  }, [isLoading, isLoadingMore, hasMore, lastDoc, fetchTaggedPosts]);

  return { posts, isLoading, isLoadingMore, hasMore, error, loadMore };
}

    