
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Only redirect if we are on the exact `/profile` page
    if (pathname === '/profile' && !isUserLoading) {
      if (user) {
        // Construct username from displayName or email
        const username = user.displayName || user.email?.split('@')[0];
        if (username) {
          router.replace(`/${username}`);
        } else {
          // Fallback if username can't be constructed
          router.replace('/');
        }
      } else {
        // If no user, redirect to login
        router.replace('/login');
      }
    }
  }, [router, user, isUserLoading, pathname]);

  // Render a loading state or null while redirect is determined
  return (
     <div className="flex h-screen items-center justify-center bg-background">
        <p>Redirecting to your profile...</p>
    </div>
  );
}
