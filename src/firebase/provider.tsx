
'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { dummyFollows } from '@/lib/dummy-data';

// Mock User type to match Firebase Auth User object structure
interface MockUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface UserAuthState {
  user: MockUser | null;
  isUserLoading: boolean;
  followedUsers: Set<string>;
}

export interface FirebaseContextState extends UserAuthState {
  login: (user: MockUser) => void;
  logout: () => void;
  toggleFollow: (username: string) => void;
}

export type UserHookResult = FirebaseContextState;

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userAuthState, setUserAuthState] = useState<Omit<UserAuthState, 'followedUsers'>>({
    user: null,
    isUserLoading: true,
  });
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Try to load user from localStorage on initial load
    try {
      const storedUser = localStorage.getItem('dummyUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserAuthState({ user, isUserLoading: false });
        const initialFollows = new Set(dummyFollows[user.uid] || []);
        setFollowedUsers(initialFollows);
      } else {
        setUserAuthState({ user: null, isUserLoading: false });
        setFollowedUsers(new Set());
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUserAuthState({ user: null, isUserLoading: false });
      setFollowedUsers(new Set());
    }
  }, []);

  const login = useCallback((user: MockUser) => {
    localStorage.setItem('dummyUser', JSON.stringify(user));
    setUserAuthState({ user, isUserLoading: false });
    const initialFollows = new Set(dummyFollows[user.uid] || []);
    setFollowedUsers(initialFollows);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dummyUser');
    setUserAuthState({ user: null, isUserLoading: false });
    setFollowedUsers(new Set());
  }, []);

  const toggleFollow = useCallback((username: string) => {
    setFollowedUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(username)) {
            newSet.delete(username);
        } else {
            newSet.add(username);
        }
        return newSet;
    });
  }, []);

  const contextValue = useMemo(() => ({
    ...userAuthState,
    followedUsers,
    login,
    logout,
    toggleFollow,
  }), [userAuthState, followedUsers, login, logout, toggleFollow]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  return context;
};

// Mock other hooks to return dummy values or no-op functions
export const useFirebase = () => ({});
export const useAuth = () => ({});
export const useFirestore = () => ({});
export const useFirebaseApp = () => ({});
export const useMemoFirebase = <T, D extends readonly any[]>(factory: () => T, deps: D) => useMemo(factory, deps);
export const useDoc = <T,>() => ({ data: null, isLoading: true, error: null });
export const useCollection = <T,>() => ({ data: [], isLoading: true, error: null });
