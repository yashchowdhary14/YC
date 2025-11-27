
'use client';

import { useState, useEffect, useCallback, useContext } from 'react';
import { FirebaseContext, FirebaseContextState } from '@/firebase/provider';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/types';


export interface UseUserHookResult {
  user: User | null;
  appUser: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  followedUsers: Set<string>;
  toggleFollow: (username: string) => void;
}

export const useUser = (): UseUserHookResult => {
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
