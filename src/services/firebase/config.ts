'use client';

import { initializeFirebase } from '@/firebase';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

try {
    if (typeof window !== 'undefined') {
        const services = initializeFirebase();
        firebaseApp = services.firebaseApp;
        auth = services.auth;
        firestore = services.firestore;
        storage = getStorage(firebaseApp);
    }
} catch (error) {
    console.error("Error initializing Firebase services:", error);
}

export const firebaseConfig = {
    get app() { return firebaseApp!; },
    get auth() { return auth!; },
    get db() { return firestore!; },
    get storage() { return storage!; },
};

export type FirebaseServices = {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
};
