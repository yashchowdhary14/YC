
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase/provider';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot, DocumentData, deleteDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface UseUserHookResult {
  user: User | null;
  appUser: AppUser | null;
  isUserLoading: boolean;
}

export const useUser = (): UseUserHookResult => {
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch app-specific user data from Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setAppUser(userDoc.data() as AppUser);
        } else {
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);
  

  return { user, appUser, isUserLoading };
};
