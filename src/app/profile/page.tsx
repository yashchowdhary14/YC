
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page as profile is disabled.
    router.replace('/');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
        <p>Redirecting...</p>
    </div>
  );
}
