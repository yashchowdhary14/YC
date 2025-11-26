
'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: FirebaseUser | null;
  isUserLoading: boolean;
  followedUsers: Set<string>;
  toggleFollow: (username: string) => void;
  login: (user: any) => void; // Keeping this for dummy login compatibility
  logout: () => void;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}> = ({ children, firebaseApp, auth, firestore }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsUserLoading(false);
      
      if (user) {
        // For real app, load follows from Firestore. For now, use localStorage.
        const storedFollows = localStorage.getItem(`followedUsers_${user.uid}`);
        if (storedFollows) {
          setFollowedUsers(new Set(JSON.parse(storedFollows)));
        } else {
          setFollowedUsers(new Set());
        }
      } else {
        setFollowedUsers(new Set());
      }
    });

    return () => unsubscribe();
  }, [auth]);
  
  // Dummy login/logout for compatibility with existing components
  const login = useCallback((user: any) => {
    setUser(user as FirebaseUser);
    localStorage.setItem('dummyUser', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    auth?.signOut();
    localStorage.removeItem('dummyUser');
    setUser(null);
  }, [auth]);


  const toggleFollow = useCallback((username: string) => {
    setFollowedUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(username)) {
            newSet.delete(username);
        } else {
            newSet.add(username);
        }
        if (user) {
             localStorage.setItem(`followedUsers_${user.uid}`, JSON.stringify(Array.from(newSet)));
        }
        return newSet;
    });
  }, [user]);

  const contextValue = useMemo(() => ({
    firebaseApp,
    auth,
    firestore,
    user,
    isUserLoading,
    followedUsers,
    toggleFollow,
    login,
    logout,
  }), [firebaseApp, auth, firestore, user, isUserLoading, followedUsers, toggleFollow, login, logout]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

// --- Hooks ---

const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider.');
  }
  return context;
};

export const useFirebaseApp = () => useFirebaseContext().firebaseApp;
export const useAuth = () => useFirebaseContext().auth;
export const useFirestore = () => useFirebaseContext().firestore;

export const useUser = () => {
  const { user, isUserLoading, followedUsers, toggleFollow, login, logout } = useFirebaseContext();
  return { user, isUserLoading, followedUsers, toggleFollow, login, logout };
};

export const useMemoFirebase = <T, D extends readonly any[]>(factory: () => T, deps: D) => useMemo(factory, deps);

    