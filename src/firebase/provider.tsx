
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, collection, onSnapshot, writeBatch, increment } from 'firebase/firestore';
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
  followedUsers: Set<string>; // Set of user IDs
}

export interface FirebaseContextState extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  toggleFollow: (profileUser: AppUser) => Promise<void>;
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

  // --- MOCK AUTHENTICATION ---
  // This useEffect bypasses real Firebase auth and sets a mock user.
  useEffect(() => {
    const mockAppUser = dummyUsers.find(u => u.username === 'wanderlust_lila')!;
    const mockUser = {
        uid: mockAppUser.id,
        displayName: mockAppUser.fullName,
        email: 'lila.kim@example.com',
        photoURL: `https://picsum.photos/seed/${mockAppUser.id}/150/150`,
        // Add other required User properties if needed
    } as User;

    setUserAuthState({
        user: mockUser,
        appUser: { ...mockAppUser, avatarUrl: mockUser.photoURL },
        isUserLoading: false,
        userError: null,
        followedUsers: new Set(['user_ethan_bytes', 'user_maya_creates']), // Pre-populate some follows
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- REAL AUTHENTICATION (Commented out) ---
  /*
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
      const newFollowedUserIds = new Set<string>();
      snapshot.docs.forEach(doc => newFollowedUserIds.add(doc.id));
      setUserAuthState(prevState => ({ ...prevState, followedUsers: newFollowedUserIds }));
    });
    return () => unsubscribe();
  }, [userAuthState.user, firestore]);
  */

  const toggleFollow = useCallback(async (profileUser: AppUser) => {
    const { user: currentUser, followedUsers } = userAuthState;
    if (!currentUser || !profileUser || currentUser.uid === profileUser.id) {
      toast({ variant: "destructive", title: "You must be logged in to follow users." });
      return;
    }

    const isCurrentlyFollowing = followedUsers.has(profileUser.id);
    const updatedFollowedUsers = new Set(followedUsers);

    // Optimistic UI update
    if (isCurrentlyFollowing) {
        updatedFollowedUsers.delete(profileUser.id);
    } else {
        updatedFollowedUsers.add(profileUser.id);
    }
    setUserAuthState(prev => ({...prev, followedUsers: updatedFollowedUsers}));

    // Simulate batch write
    console.log(`Simulating ${isCurrentlyFollowing ? 'unfollow' : 'follow'} for user: ${profileUser.username}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({ title: isCurrentlyFollowing ? `Unfollowed ${profileUser.username}` : `Followed ${profileUser.username}` });
    
  }, [userAuthState, toast]);

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
