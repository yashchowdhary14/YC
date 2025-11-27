import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    UploadResult
} from 'firebase/storage';
import { firebaseConfig } from './config';

const storage = firebaseConfig.storage;

export const uploadFile = async (path: string, file: File | Blob): Promise<UploadResult> => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return snapshot;
    } catch (error) {
        console.error(`Error uploading file to ${path}:`, error);
        throw error;
    }
};

export const getFileUrl = async (path: string): Promise<string> => {
    try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error(`Error getting download URL for ${path}:`, error);
        throw error;
    }
};

export const deleteFile = async (path: string): Promise<void> => {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error) {
        console.error(`Error deleting file at ${path}:`, error);
        throw error;
    }
};
