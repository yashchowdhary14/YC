
'use client';
<<<<<<< HEAD

=======
    
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  // Load from cache on mount
  useEffect(() => {
    if (!memoizedDocRef) return;

    const key = `firestore_cache_doc_${memoizedDocRef.path}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
  }, [memoizedDocRef]);

=======
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Optional: setData(null); // Clear previous data instantly

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
<<<<<<< HEAD
          const docData = { ...(snapshot.data() as T), id: snapshot.id };
          setData(docData);

          // Update cache
          try {
            const key = `firestore_cache_doc_${memoizedDocRef.path}`;
            localStorage.setItem(key, JSON.stringify(docData));
          } catch (e) {
            console.warn('Error writing to localStorage', e);
          }
        } else {
          // Document does not exist
          setData(null);
          // Clear cache if doc doesn't exist? Or keep last known? 
          // Better to clear or ignore. Let's clear to be safe.
          try {
            const key = `firestore_cache_doc_${memoizedDocRef.path}`;
            localStorage.removeItem(key);
          } catch (e) { }
=======
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          // Document does not exist
          setData(null);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
        }
        setError(null); // Clear any previous error on successful snapshot (even if doc doesn't exist)
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]); // Re-run if the memoizedDocRef changes.

  return { data, isLoading, error };
}
