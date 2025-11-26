
'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This provider now just wraps the dummy-data-ready FirebaseProvider
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}
