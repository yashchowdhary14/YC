
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { dummyUsers } from '@/lib/dummy-data';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Only redirect if we are on the exact `/profile` page
    if (pathname === '/profile') {
        if (!isUserLoading && !user) {
            router.replace('/login');
        } else if (user) {
            // Find the user in the dummy data based on their UID
            const userProfile = dummyUsers.find(u => u.id === user.uid);
            
            if (userProfile && userProfile.username) {
                router.replace(`/${userProfile.username}`);
            } else {
                // Fallback for safety, though it shouldn't be hit with dummy data
                router.replace('/');
            }
        }
    }
  }, [user, isUserLoading, pathname, router]);

  // Render a loading state while we determine the redirect
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
