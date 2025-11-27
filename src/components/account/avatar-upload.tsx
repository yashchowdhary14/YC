import { useRef, ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
    photoUrl: string | null;
    onChange: (url: string | null) => void;
}

export default function AvatarUpload({ photoUrl, onChange }: AvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(photoUrl);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            // In a real implementation, you would upload to Firebase Storage here
            // and obtain a URL. For now we just pass the data URL back.
            onChange(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
                {preview ? (
                    <Image
                        src={preview}
                        alt="Profile avatar"
                        fill
                        className={cn('rounded-full object-cover', 'border-2 border-primary')}
                    />
                ) : (
                    <div className={cn('w-full h-full rounded-full bg-muted flex items-center justify-center')}>?
                    </div>
                )}
            </div>
            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
                )}
            >
                Change Photo
            </button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
