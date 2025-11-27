'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateModal } from '@/components/create/CreateModal';
import { useCreateStore } from '@/lib/create-store';

export default function CreateReelPage() {
    const router = useRouter();
    const { setMode, setStep, reset } = useCreateStore();

    useEffect(() => {
        reset();
        setMode('video'); // or 'reel' depending on how you want to handle it, but 'video' covers both in the modal for now or we can be specific
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
