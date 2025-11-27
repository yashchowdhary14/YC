
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateModal } from '@/components/create/CreateModal';
import { useCreateStore } from '@/lib/create-store';

export default function CreatePostPage() {
    const router = useRouter();
    const { setMode, setStep, reset } = useCreateStore();

    useEffect(() => {
        reset();
        setMode('post');
        setStep('media-picker');
    }, [setMode, setStep, reset]);

    const handleClose = () => {
        router.push('/create');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <CreateModal open={true} onClose={handleClose} />
        </div>
    );
}
