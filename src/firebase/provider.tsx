
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { dummyUsers } from '@/lib/dummy-data';
import { dummyFollows } from '@/lib/dummy-data';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: (User & { photoURL?: string | null }) | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Dummy data enhanced User type
type AppUser = User & {
    photoURL?: string | null;
};

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: AppUser | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null;
  login: (user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; }) => void;
  logout: () => void;
  followedUsers: Set<string>;
  toggleFollow: (username: string) => void;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  login: (user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; }) => void;
  logout: () => void;
  followedUsers: Set<string>;
  toggleFollow: (username:string) => void;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { 
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  login: (user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; }) => void;
  logout: () => void;
  followedUsers: Set<string>;
  toggleFollow: (username:string) => void;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  // Dummy Auth handlers
  const login = (user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; }) => {
    setUserAuthState({ user: user as AppUser, isUserLoading: false, userError: null });
    // Load initial followed users from dummy data
    const initialFollows = dummyFollows[user.uid] || [];
    const followedUsernames = new Set(initialFollows.map(id => dummyUsers.find(u => u.id === id)?.username).filter(Boolean) as string[]);
    setFollowedUsers(followedUsernames);
  };
  
  const logout = () => {
    setUserAuthState({ user: null, isUserLoading: false, userError: null });
    setFollowedUsers(new Set());
  };

  const toggleFollow = (username: string) => {
    setFollowedUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(username)) {
            newSet.delete(username);
        } else {
            newSet.add(username);
        }
        return newSet;
    });
  }


  // Effect to subscribe to Firebase auth state changes (currently mocked)
  useEffect(() => {
     setUserAuthState({ user: null, isUserLoading: false, userError: null });
  }, []);

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
      login,
      logout,
      followedUsers,
      toggleFollow,
    };
  }, [firebaseApp, firestore, auth, userAuthState, followedUsers]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    login: context.login,
    logout: context.logout,
    followedUsers: context.followedUsers,
    toggleFollow: context.toggleFollow,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
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

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError, login, logout, followedUsers, toggleFollow } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError, login, logout, followedUsers, toggleFollow };
};
