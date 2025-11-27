import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useUser } from '@/firebase'; // assuming a hook that returns current user
import AvatarUpload from '@/components/account/avatar-upload';
import BioEditor from '@/components/account/bio-editor';
import { cn } from '@/lib/utils';

export default function ProfileEditForm() {
    const { user, loading } = useUser();
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    // Load initial data when user is ready
    useEffect(() => {
        if (!loading && user) {
            setDisplayName(user.displayName ?? '');
            setUsername(user.username ?? '');
            setWebsite(user.website ?? '');
            setBio(user.bio ?? '');
            setProfilePhoto(user.photoURL ?? null);
        }
    }, [loading, user]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // TODO: integrate with Firebase Firestore & Storage
        console.log('Saving profile', { displayName, username, website, bio, profilePhoto });
        // Show a toast or UI feedback here
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn('space-y-6', 'max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg')}
        >
            <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>

            {/* Avatar Upload */}
            <AvatarUpload photoUrl={profilePhoto} onChange={setProfilePhoto} />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className={cn(
                            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                        )}
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={cn(
                            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                        )}
                        placeholder="@username"
                    />
                </div>
            </div>

            {/* Website */}
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
                <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className={cn(
                        'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    )}
                    placeholder="https://your-site.com"
                />
            </div>

            {/* Bio */}
            <BioEditor bio={bio} setBio={setBio} maxLength={150} />

            <div className="flex justify-end">
                <button
                    type="submit"
                    className={cn(
                        'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
                        'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    )}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
