
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, collection, onSnapshot, writeBatch, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
<<<<<<< HEAD
import { getStorage } from 'firebase/storage';
=======
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
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

<<<<<<< HEAD
  // Listen for real Firebase auth state changes
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        // In a real app, you might fetch additional user details from Firestore here
        // For now, we'll construct the AppUser from the Auth User
        const appUser: AppUser = {
          id: user.uid,
          username: user.displayName?.replace(/\s+/g, '_').toLowerCase() || 'user', // Fallback username
          fullName: user.displayName || 'User',
          avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/150/150`,
          bio: 'No bio yet.', // Placeholder
          followersCount: 0,
          followingCount: 0,
          followers: [],
          following: [],
          verified: false,
        };

        setUserAuthState(prev => ({
          ...prev,
          user: user,
          appUser: appUser,
          isUserLoading: false,
          userError: null,
          // Keep existing followedUsers or fetch them
          // followedUsers: prev.followedUsers 
        }));
      } else {
        // User is signed out
        setUserAuthState(prev => ({
          ...prev,
          user: null,
          appUser: null,
          isUserLoading: false,
          userError: null,
          followedUsers: new Set(),
        }));
      }
    }, (error) => {
      console.error("Auth state change error:", error);
      setUserAuthState(prev => ({
        ...prev,
        isUserLoading: false,
        userError: error,
      }));
    });

    return () => unsubscribe();
  }, [auth]);
=======
  // --- MOCK AUTHENTICATION & DATA ---
  // This useEffect bypasses real Firebase auth and sets a mock user.
  useEffect(() => {
    const mockAppUser = dummyUsers.find(u => u.username === 'wanderlust_lila')!;
    const mockUser = {
        uid: mockAppUser.id,
        displayName: mockAppUser.fullName,
        email: 'lila.kim@example.com',
        photoURL: `https://picsum.photos/seed/${mockAppUser.id}/150/150`,
    } as User;

    setUserAuthState({
        user: mockUser,
        appUser: { ...mockAppUser, avatarUrl: mockUser.photoURL },
        isUserLoading: false,
        userError: null,
        followedUsers: new Set(['user_ethan_bytes', 'user_maya_creates']),
    });
  }, []);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

  const toggleFollow = useCallback(async (profileUser: AppUser) => {
    const { user: currentUser } = userAuthState;

    if (!currentUser || !firestore) {
      toast({ variant: "destructive", title: "You must be logged in to follow users." });
      return;
    }
    if (currentUser.uid === profileUser.id) return;

    const isCurrentlyFollowing = userAuthState.followedUsers.has(profileUser.id);
    const updatedFollowedUsers = new Set(userAuthState.followedUsers);
<<<<<<< HEAD

    // Optimistic UI update
    if (isCurrentlyFollowing) {
      updatedFollowedUsers.delete(profileUser.id);
    } else {
      updatedFollowedUsers.add(profileUser.id);
    }
    setUserAuthState(prev => ({ ...prev, followedUsers: updatedFollowedUsers }));

    try {
      const batch = writeBatch(firestore);

      const currentUserRef = doc(firestore, 'users', currentUser.uid);
      const profileUserRef = doc(firestore, 'users', profileUser.id);

      if (isCurrentlyFollowing) {
        batch.update(currentUserRef, { following: arrayRemove(profileUser.id) });
        batch.update(profileUserRef, { followers: arrayRemove(currentUser.uid) });
      } else {
        batch.update(currentUserRef, { following: arrayUnion(profileUser.id) });
        batch.update(profileUserRef, { followers: arrayUnion(currentUser.uid) });
      }

      await batch.commit();

      toast({ title: isCurrentlyFollowing ? `Unfollowed ${profileUser.username}` : `Followed ${profileUser.username}` });

    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert optimistic update on failure
      setUserAuthState(prev => ({ ...prev, followedUsers: prev.followedUsers }));
      toast({ variant: 'destructive', title: 'Something went wrong', description: 'Could not update follow status.' })
=======
    
    // Optimistic UI update
    if (isCurrentlyFollowing) {
        updatedFollowedUsers.delete(profileUser.id);
    } else {
        updatedFollowedUsers.add(profileUser.id);
    }
    setUserAuthState(prev => ({...prev, followedUsers: updatedFollowedUsers}));

    try {
        const batch = writeBatch(firestore);
        
        const currentUserRef = doc(firestore, 'users', currentUser.uid);
        const profileUserRef = doc(firestore, 'users', profileUser.id);

        if (isCurrentlyFollowing) {
            batch.update(currentUserRef, { following: arrayRemove(profileUser.id) });
            batch.update(profileUserRef, { followers: arrayRemove(currentUser.uid) });
        } else {
            batch.update(currentUserRef, { following: arrayUnion(profileUser.id) });
            batch.update(profileUserRef, { followers: arrayUnion(currentUser.uid) });
        }

        await batch.commit();

        toast({ title: isCurrentlyFollowing ? `Unfollowed ${profileUser.username}` : `Followed ${profileUser.username}` });

    } catch (error) {
        console.error("Error toggling follow:", error);
        // Revert optimistic update on failure
        setUserAuthState(prev => ({...prev, followedUsers: prev.followedUsers}));
        toast({ variant: 'destructive', title: 'Something went wrong', description: 'Could not update follow status.'})
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
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

<<<<<<< HEAD
export const useStorage = () => {
  const { firebaseApp } = useFirebase();
  return getStorage(firebaseApp);
};

type MemoFirebase<T> = T & { __memo?: boolean };

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);

  if (typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;

=======
type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
  return memoized;
}
