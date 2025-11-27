<<<<<<< HEAD
=======

>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
<<<<<<< HEAD
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
=======
import { getFirestore } from 'firebase/firestore'
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
<<<<<<< HEAD
  let firestoreInstance: Firestore | null = null;

  try {
    // Try to initialize Firestore with persistence
    firestoreInstance = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (e: any) {
    // If already initialized, just use getFirestore
    if (e && e.message && e.message.includes("already been called")) {
      firestoreInstance = getFirestore(firebaseApp);
    } else {
      throw e;
    }
  }

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: firestoreInstance
=======
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
  };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
