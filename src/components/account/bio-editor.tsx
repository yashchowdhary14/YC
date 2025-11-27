import { useState, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface BioEditorProps {
    bio: string;
    setBio: (value: string) => void;
    maxLength?: number;
}

export default function BioEditor({ bio, setBio, maxLength = 150 }: BioEditorProps) {
    const [remaining, setRemaining] = useState(maxLength - bio.length);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setBio(value);
            setRemaining(maxLength - value.length);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
            <textarea
                value={bio}
                onChange={handleChange}
                rows={3}
                className={cn(
                    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                )}
                placeholder="Tell something about yourself..."
            />
            <p className="text-xs text-muted-foreground text-right">{remaining} characters remaining</p>
        </div>
    );
}
