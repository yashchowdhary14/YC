
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  where,
  documentId,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Post } from '@/lib/types';
import { getHydratedUser } from '@/lib/dummy-data';

const POSTS_PER_PAGE = 12;

interface UseSavedPostsResult {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
}

export function useSavedPosts(userId: string): UseSavedPostsResult {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSavedPosts = useCallback(async (lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
    if (!userId) return;

    if (lastVisibleDoc === null) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
        // Step 1: Fetch the saved post references
        const savedPostsRef = collection(firestore, `users/${userId}/savedPosts`);
        let savedQuery = query(
            savedPostsRef,
            orderBy('savedAt', 'desc'),
            limit(POSTS_PER_PAGE)
        );

        if (lastVisibleDoc) {
            savedQuery = query(savedQuery, startAfter(lastVisibleDoc));
        }

        const savedSnapshot = await getDocs(savedQuery);
        const postIds = savedSnapshot.docs.map(doc => doc.data().postId);
        
        setLastDoc(savedSnapshot.docs[savedSnapshot.docs.length - 1] || null);
        setHasMore(savedSnapshot.docs.length === POSTS_PER_PAGE);

        if (postIds.length === 0) {
            if (!lastVisibleDoc) setPosts([]); // Clear posts if it's the initial fetch and no saved posts are found
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
        }

        // Step 2: Fetch the actual post documents
        const postsRef = collection(firestore, 'posts');
        const postsQuery = query(postsRef, where(documentId(), 'in', postIds));
        const postsSnapshot = await getDocs(postsQuery);

        // We need to re-order the posts based on the `savedAt` timestamp
        const fetchedPosts = postsSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {
                ...(doc.data() as Omit<Post, 'user'>),
                id: doc.id,
                user: getHydratedUser(doc.data().uploaderId),
            } as Post;
            return acc;
        }, {} as { [key: string]: Post });
        
        const newPosts = postIds.map(id => fetchedPosts[id]).filter(Boolean); // Filter out any posts that might have been deleted

        setPosts(prev => lastVisibleDoc ? [...prev, ...newPosts] : newPosts);

    } catch (e) {
      console.error("Error fetching saved posts:", e);
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
    fetchSavedPosts();
  }, [fetchSavedPosts]);


  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && lastDoc) {
      fetchSavedPosts(lastDoc);
    }
  }, [isLoading, isLoadingMore, hasMore, lastDoc, fetchSavedPosts]);

  return { posts, isLoading, isLoadingMore, hasMore, error, loadMore };
}
