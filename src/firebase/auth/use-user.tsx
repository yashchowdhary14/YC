
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
  followedUsers: Set<string>;
  toggleFollow: (username: string) => void;
}

export const useUser = (): UseUserHookResult => {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [followedUsersMap, setFollowedUsersMap] = useState<Map<string, string>>(new Map());

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
  
  useEffect(() => {
    if (!user) {
        setFollowedUsers(new Set());
        setFollowedUsersMap(new Map());
        return;
    }
    
    const followingCollectionRef = collection(firestore, `users/${user.uid}/following`);
    const unsubscribe = onSnapshot(followingCollectionRef, (snapshot) => {
        const newFollowedUsernames = new Set<string>();
        const newFollowedUsersMap = new Map<string, string>();
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            // We assume the document ID is the username and data might contain userId
            newFollowedUsernames.add(doc.id);
            newFollowedUsersMap.set(doc.id, data.userId);
        });
        setFollowedUsers(newFollowedUsernames);
        setFollowedUsersMap(newFollowedUsersMap);
    });

    return () => unsubscribe();

  }, [user, firestore]);

  const toggleFollow = useCallback(async (username: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to follow users.',
      });
      return;
    }

    const isFollowing = followedUsers.has(username);
    const followDocRef = doc(firestore, `users/${user.uid}/following`, username);
    
    try {
        if (isFollowing) {
            await deleteDoc(followDocRef);
            toast({ title: `Unfollowed ${username}` });
        } else {
            // Find the user to follow by their username to get their ID
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast({ variant: "destructive", title: `User ${username} not found.` });
                return;
            }
            
            const targetUserDoc = querySnapshot.docs[0];
            await setDoc(followDocRef, { userId: targetUserDoc.id });
            toast({ title: `Followed ${username}` });
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
        toast({ variant: "destructive", title: "Something went wrong" });
    }
  }, [user, firestore, followedUsers, toast]);

  return { user, appUser, isUserLoading, followedUsers, toggleFollow };
};

    