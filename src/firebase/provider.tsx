
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, collection, onSnapshot, deleteDoc, setDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/lib/types';
import { dummyUsers } from '@/lib/dummy-data';

interface UserAuthState {
  user: User | null;
  appUser: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  followedUsers: Set<string>; // Set of usernames
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  appUser: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  followedUsers: Set<string>;
  toggleFollow: (username: string) => void;
}

export interface FirebaseServicesAndUser extends Omit<FirebaseContextState, 'areServicesAvailable'> {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}


interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const { toast } = useToast();
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    appUser: null,
    isUserLoading: true,
    userError: null,
    followedUsers: new Set(),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const appUser = userDoc.exists() ? (userDoc.data() as AppUser) : null;

          setUserAuthState(prevState => ({
            ...prevState,
            user,
            appUser,
            isUserLoading: false,
            userError: null,
          }));
        } else {
          setUserAuthState({
            user: null,
            appUser: null,
            isUserLoading: false,
            userError: null,
            followedUsers: new Set(),
          });
        }
      },
      (error) => {
        setUserAuthState({
            user: null,
            appUser: null,
            isUserLoading: false,
            userError: error,
            followedUsers: new Set(),
        });
      }
    );
    return () => unsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    if (!userAuthState.user) {
      setUserAuthState(prevState => ({ ...prevState, followedUsers: new Set() }));
      return;
    }
    const followingCollectionRef = collection(firestore, `users/${userAuthState.user.uid}/following`);
    const unsubscribe = onSnapshot(followingCollectionRef, (snapshot) => {
      const newFollowedUsernames = new Set<string>();
      snapshot.docs.forEach(doc => newFollowedUsernames.add(doc.id));
      setUserAuthState(prevState => ({ ...prevState, followedUsers: newFollowedUsernames }));
    });
    return () => unsubscribe();
  }, [userAuthState.user, firestore]);

  const toggleFollow = useCallback(async (username: string) => {
    const { user, followedUsers } = userAuthState;
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in." });
      return;
    }

    const isFollowing = followedUsers.has(username);
    const followDocRef = doc(firestore, `users/${user.uid}/following`, username);

    try {
      if (isFollowing) {
        await deleteDoc(followDocRef);
        toast({ title: `Unfollowed ${username}` });
      } else {
        // In a real app, you'd need to look up the user's ID from their username
        // For this dummy implementation, we find it from the imported list
        const targetUser = dummyUsers.find(u => u.username === username);
        if (targetUser) {
           await setDoc(followDocRef, { userId: targetUser.id });
           toast({ title: `Followed ${username}` });
        } else {
           toast({ variant: "destructive", title: `User ${username} not found.` });
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({ variant: "destructive", title: "An error occurred." });
    }
  }, [userAuthState, firestore, toast]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      appUser: userAuthState.appUser,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
      followedUsers: userAuthState.followedUsers,
      toggleFollow,
    };
  }, [firebaseApp, firestore, auth, userAuthState, toggleFollow]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }
  return context as FirebaseServicesAndUser;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

// The main `useUser` hook is now in its own file: `firebase/auth/use-user.tsx`
// This file will export a version that includes the `toggleFollow` and `followedUsers` for convenience
// in components that don't want to import from two places.

export interface UserHookResult {
  user: User | null;
  appUser: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  followedUsers: Set<string>;
  toggleFollow: (username: string) => void;
}

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  return {
    user: context.user,
    appUser: context.appUser,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    followedUsers: context.followedUsers,
    toggleFollow: context.toggleFollow,
  };
};
