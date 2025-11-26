
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer in use and will redirect to the homepage.
export default function DeprecatedSearchPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/');
    }, [router]);

    return null;
}
