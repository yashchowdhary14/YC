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
import { getHydratedUser, dummyPosts } from '@/lib/dummy-data';

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
  // We'll use dummy data for this step to demonstrate the hook's functionality
  // without requiring a live Firestore connection with seeded data.
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);

  const allPosts = dummyPosts.filter(p => p.type === 'photo');

  const fetchPosts = useCallback(() => {
    if (page === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

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
}
