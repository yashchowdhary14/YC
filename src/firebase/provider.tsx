
'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';

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
}

export interface FirebaseContextState extends UserAuthState {
  login: (user: MockUser) => void;
  logout: () => void;
}

export type UserHookResult = FirebaseContextState;

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
  });

  useEffect(() => {
    // Try to load user from localStorage on initial load
    try {
      const storedUser = localStorage.getItem('dummyUser');
      if (storedUser) {
        setUserAuthState({ user: JSON.parse(storedUser), isUserLoading: false });
      } else {
        setUserAuthState({ user: null, isUserLoading: false });
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUserAuthState({ user: null, isUserLoading: false });
    }
  }, []);

  const login = useCallback((user: MockUser) => {
    localStorage.setItem('dummyUser', JSON.stringify(user));
    setUserAuthState({ user, isUserLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dummyUser');
    setUserAuthState({ user: null, isUserLoading: false });
  }, []);

  const contextValue = useMemo(() => ({
    ...userAuthState,
    login,
    logout,
  }), [userAuthState, login, logout]);

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
