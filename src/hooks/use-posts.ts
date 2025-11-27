'use client';

<<<<<<< HEAD
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
=======
import { useState, useCallback, useEffect } from 'react';
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
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
import { getHydratedUser, dummyPosts } from '@/lib/dummy-data';
<<<<<<< HEAD
import { throttle } from '@/lib/utils';
=======
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

const POSTS_PER_PAGE = 5;

interface UsePostsResult {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
}

export function usePosts(userId?: string): UsePostsResult {
<<<<<<< HEAD
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
=======
  // We'll use dummy data for this step to demonstrate the hook's functionality
  // without requiring a live Firestore connection with seeded data.
  const [posts, setPosts] = useState<Post[]>([]);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
<<<<<<< HEAD

  const fetchPosts = useCallback(async (lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
    if (lastVisibleDoc === null) {
=======
  const [page, setPage] = useState(0);

  const allPosts = dummyPosts.filter(p => p.type === 'photo');

  const fetchPosts = useCallback(() => {
    if (page === 0) {
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
<<<<<<< HEAD
    setError(null);

    try {
      const postsRef = collection(firestore, 'posts');
      let q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      if (userId) {
        q = query(q, where('uploaderId', '==', userId));
      } else {
        // For main feed, we might want to filter by type 'photo' if that's the intention
        // based on the previous dummy data filter: dummyPosts.filter(p => p.type === 'photo');
        // However, usually a feed shows all types. Let's stick to the plan and just show all or filter if needed.
        // The previous code did: const allPosts = dummyPosts.filter(p => p.type === 'photo');
        // Let's add that filter to match behavior if it's a photo feed.
        q = query(q, where('type', '==', 'photo'));
      }

      if (lastVisibleDoc) {
        q = query(q, startAfter(lastVisibleDoc));
      }

      const querySnapshot = await getDocs(q);

      // Fetch user details for each post
      // In a real app, you might denormalize user data onto the post, 
      // or use a separate user cache to avoid N+1 reads.
      // For now, we'll fetch them in parallel.
      const newPosts = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const rawData = docSnapshot.data();
        const mediaUrls = rawData.mediaUrls || (rawData.mediaUrl ? [rawData.mediaUrl] : []);

        let user: any = { id: rawData.uploaderId, username: 'Unknown', fullName: 'Unknown' };

        try {
          // Try to fetch user data. 
          // Optimization: In a real app, implement a user cache here.
          const userDoc = await getDocs(query(collection(firestore, 'users'), where('id', '==', rawData.uploaderId), limit(1)));
          if (!userDoc.empty) {
            user = userDoc.docs[0].data();
          }
        } catch (e) {
          console.error("Error fetching user for post", docSnapshot.id, e);
        }

        return {
          ...rawData,
          mediaUrls,
          id: docSnapshot.id,
          user: user,
        } as Post;
      }));

      setPosts(prev => lastVisibleDoc ? [...prev, ...newPosts] : newPosts);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE);

    } catch (e) {
      console.error("Error fetching posts:", e);
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [firestore, userId]);

  useEffect(() => {
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    fetchPosts();
  }, [fetchPosts]); // fetchPosts dependency includes userId

  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && lastDoc) {
      fetchPosts(lastDoc);
    }
  }, [isLoading, isLoadingMore, hasMore, lastDoc, fetchPosts]);

  // Throttle loadMore to prevent rapid calls
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const throttledLoadMore = useMemo(() => throttle(() => loadMoreRef.current(), 1000), []);

  return { posts, isLoading, isLoadingMore, hasMore, error, loadMore: throttledLoadMore };
=======

    setTimeout(() => {
      const start = page * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      const newPosts = allPosts.slice(start, end);

      setPosts(prev => (page === 0 ? newPosts : [...prev, ...newPosts]));
      setHasMore(end < allPosts.length);
      setIsLoading(false);
      setIsLoadingMore(false);
    }, 500 + Math.random() * 500); // Simulate network delay

  }, [page]);
  
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    // The fetch will be triggered by the `page` change in loadMore
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);


  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
        setPage(p => p + 1);
    }
  }, [isLoading, isLoadingMore, hasMore]);

  return { posts, isLoading, isLoadingMore, hasMore, error, loadMore };
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
}
