
'use client';

import { useContext } from 'react';
import { FirebaseContext } from '@/firebase/provider';
import { User } from 'firebase/auth';
import type { User as AppUser } from '@/lib/types';


export interface UseUserHookResult {
  user: User | null;
  appUser: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  followedUsers: Set<string>;
  toggleFollow: (profileUser: AppUser) => Promise<void>;
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
