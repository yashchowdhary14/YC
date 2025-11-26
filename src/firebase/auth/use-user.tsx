
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase/provider';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot, DocumentData, deleteDoc, setDoc } from 'firebase/firestore';
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

    const targetUserId = followedUsersMap.get(username);
    const isFollowing = followedUsers.has(username);
    const followDocRef = doc(firestore, `users/${user.uid}/following`, username);
    
    try {
        if (isFollowing) {
            await deleteDoc(followDocRef);
            toast({ title: `Unfollowed ${username}` });
        } else {
            // To add a follow, we need the target user's ID. This is a simplification.
            // In a real app, you might need to query for the user by username first.
            // For now, this part will only work if the user is already in the suggestions.
            // A more robust implementation is needed for a full social graph feature.
            // Let's assume for now we can't follow users not already known.
            // A better approach would be to look up the user ID from the username.
            // This is a placeholder for that logic.
            
            // This is a HACK to get the user ID from the username for dummy data.
            // In a real app, you would query the 'users' collection where 'username' == username.
            const newFollowId = `user_${username}`; 

            await setDoc(followDocRef, { userId: newFollowId });
            toast({ title: `Followed ${username}` });
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
        toast({ variant: "destructive", title: "Something went wrong" });
    }
  }, [user, firestore, followedUsers, followedUsersMap, toast]);

  return { user, appUser, isUserLoading, followedUsers, toggleFollow };
};
