import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot
} from 'firebase/firestore';
import { firebaseConfig } from './config';

const db = firebaseConfig.db;

export const addData = async (collectionPath: string, data: DocumentData): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, collectionPath), data);
        return docRef.id;
    } catch (error) {
        console.error(`Error adding document to ${collectionPath}:`, error);
        throw error;
    }
};

export const getData = async (collectionPath: string): Promise<DocumentData[]> => {
    try {
        const querySnapshot: QuerySnapshot = await getDocs(collection(db, collectionPath));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error getting documents from ${collectionPath}:`, error);
        throw error;
    }
};

export const getDocument = async (collectionPath: string, docId: string): Promise<DocumentData | null> => {
    try {
        const docRef = doc(db, collectionPath, docId);
        const docSnap: DocumentSnapshot = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn(`Document ${docId} not found in ${collectionPath}`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting document ${docId} from ${collectionPath}:`, error);
        throw error;
    }
};

export const updateDocument = async (collectionPath: string, docId: string, data: DocumentData): Promise<void> => {
    try {
        const docRef = doc(db, collectionPath, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
        throw error;
    }
};

export const deleteDocument = async (collectionPath: string, docId: string): Promise<void> => {
    try {
        const docRef = doc(db, collectionPath, docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Error deleting document ${docId} from ${collectionPath}:`, error);
        throw error;
    }
};
