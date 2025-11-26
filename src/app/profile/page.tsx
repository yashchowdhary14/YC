
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading) {
      // Wait until user state is determined
      return;
    }
    if (!user) {
      // If user is not logged in, redirect to login page
      router.replace('/login');
    } else {
      // If user is logged in, redirect to their dynamic profile page
      // We need to get the username from the user object.
      // Assuming the username is stored in a field like `displayName` or a custom field.
      // For now, let's assume it's in displayName for redirection.
      // A robust solution would fetch the user doc from firestore to get the username.
      const username = user.displayName || user.email?.split('@')[0];
      if (username) {
        router.replace(`/${username}`);
      } else {
        // Fallback if username can't be determined
        router.replace('/');
      }
    }
  }, [isUserLoading, user, router]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
