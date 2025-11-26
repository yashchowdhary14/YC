'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Loader2 } from 'lucide-react';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Only redirect if we are on the exact `/profile` page
    if (pathname === '/profile') {
        if (!isUserLoading && !user) {
            router.replace('/login');
        } else if (user && userProfile) {
            if (userProfile.username) {
                router.replace(`/${userProfile.username}`);
            } else {
                // Fallback to old method if username is missing from profile
                const username = user.displayName || user.email?.split('@')[0];
                if (username) {
                    router.replace(`/${username}`);
                } else {
                    router.replace('/');
                }
            }
        }
    }
  }, [user, isUserLoading, userProfile, isProfileLoading, pathname, router]);

  // Render a loading state while we determine the redirect
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
