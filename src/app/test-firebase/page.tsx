'use client';

import { useState, useEffect } from 'react';
import { signInWithGoogle, logout, getCurrentUser } from '@/services/firebase/auth';
import { addData, getData } from '@/services/firebase/firestore';
import { uploadFile, getFileUrl } from '@/services/firebase/storage';
import { User } from 'firebase/auth';

export default function TestFirebasePage() {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<string>('');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        getCurrentUser().then(setUser).catch(console.error);
    }, []);

    const handleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            setUser(user);
            setStatus('Logged in successfully');
        } catch (error: any) {
            setStatus(`Login failed: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            setStatus('Logged out');
        } catch (error: any) {
            setStatus(`Logout failed: ${error.message}`);
        }
    };

    const handleFirestoreTest = async () => {
        if (!user) {
            setStatus('Please login first to test Firestore');
            return;
        }
        try {
            const id = await addData('posts', {
                userId: user.uid,
                content: 'Test post',
                timestamp: new Date(),
                test: true
            });
            setStatus(`Added document to posts with ID: ${id}`);
            const docs = await getData('posts');
            setData(docs.slice(0, 5));
        } catch (error: any) {
            setStatus(`Firestore test failed: ${error.message}`);
        }
    };

    const handleStorageTest = async () => {
        try {
            const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
            const file = new File([blob], 'test.txt', { type: 'text/plain' });
            await uploadFile('test/test.txt', file);
            const url = await getFileUrl('test/test.txt');
            setStatus(`File uploaded. URL: ${url}`);
        } catch (error: any) {
            setStatus(`Storage test failed: ${error.message}`);
        }
    };

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Firebase Integration Test</h1>

            <div className="space-x-4">
                <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
            </div>

            <div>
                <h2 className="text-xl font-semibold">User:</h2>
                <pre>{user ? JSON.stringify(user.uid, null, 2) : 'Not logged in'}</pre>
            </div>

            <div className="space-x-4">
                <button onClick={handleFirestoreTest} className="px-4 py-2 bg-green-500 text-white rounded">Test Firestore</button>
                <button onClick={handleStorageTest} className="px-4 py-2 bg-yellow-500 text-white rounded">Test Storage</button>
            </div>

            <div>
                <h2 className="text-xl font-semibold">Status:</h2>
                <p>{status}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold">Firestore Data:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}
