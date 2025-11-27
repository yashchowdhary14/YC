<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, Camera, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function EditProfilePage() {
    const { user, appUser, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        bio: '',
        website: '',
        gender: '',
        pronouns: '',
    });

    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (appUser) {
            setFormData({
                username: appUser.username || '',
                fullName: appUser.fullName || '',
                bio: appUser.bio || '',
                website: '',
                gender: '',
                pronouns: '',
            });
            setAvatarPreview(appUser.avatarUrl || '');
        }
    }, [appUser]);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    variant: 'destructive',
                    title: 'File too large',
                    description: 'Please select an image smaller than 2MB.',
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setHasChanges(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
        });

        setIsSubmitting(false);
        setHasChanges(false);
        router.push('/profile');
    };
=======

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import DashboardNav from '@/components/account/DashboardNav';
import EditProfileForm from '@/components/account/EditProfileForm';
import PrivacySettings from '@/components/account/PrivacySettings';
import SavedPostsGrid from '@/components/profile/SavedPostsGrid';
import { Card, CardContent } from '@/components/ui/card';

export type ActiveTab = 'edit' | 'saved' | 'privacy' | 'liked';

export default function AccountEditPage() {
    const { user, appUser, isUserLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('edit');

    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') as ActiveTab;
        if (tabFromUrl && ['edit', 'saved', 'privacy', 'liked'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

<<<<<<< HEAD
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background pt-14">
            <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">Edit Profile</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-background">
                                <AvatarImage src={avatarPreview} />
                                <AvatarFallback className="text-2xl">
                                    {formData.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="h-6 w-6 text-white" />
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">{formData.username}</p>
                            <label htmlFor="avatar-upload" className="text-sm text-primary cursor-pointer hover:underline">
                                Change profile photo
                            </label>
                        </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                placeholder="username"
                                className="focus-ring-enhanced"
                            />
                            <p className="text-xs text-muted-foreground">
                                Your username can only be changed once every 14 days.
                            </p>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Name</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="Full Name"
                                className="focus-ring-enhanced"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                maxLength={150}
                                rows={4}
                                className="resize-none focus-ring-enhanced"
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.bio.length}/150
                            </p>
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                placeholder="https://example.com"
                                className="focus-ring-enhanced"
                            />
                        </div>

                        <Separator />

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input
                                id="gender"
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                placeholder="Gender (optional)"
                                className="focus-ring-enhanced"
                            />
                            <p className="text-xs text-muted-foreground">
                                This won't be part of your public profile.
                            </p>
                        </div>

                        {/* Pronouns */}
                        <div className="space-y-2">
                            <Label htmlFor="pronouns">Pronouns</Label>
                            <Input
                                id="pronouns"
                                value={formData.pronouns}
                                onChange={(e) => handleInputChange('pronouns', e.target.value)}
                                placeholder="e.g., they/them"
                                className="focus-ring-enhanced"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={!hasChanges || isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/profile')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>

                {/* Additional Settings Links */}
                <div className="mt-8 space-y-2">
                    <Link href="/account/privacy">
                        <Button variant="ghost" className="w-full justify-start text-primary">
                            Privacy and Security
                        </Button>
                    </Link>
                    <Link href="/account/notifications">
                        <Button variant="ghost" className="w-full justify-start text-primary">
                            Notification Settings
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
=======
    if (!user || !appUser) {
        router.push('/login');
        return null;
    }
    
    const renderContent = () => {
        switch (activeTab) {
            case 'edit':
                return <EditProfileForm user={user} appUser={appUser} />;
            case 'saved':
                return <SavedPostsGrid userId={user.uid} />;
            case 'liked':
                // For now, we can re-use the saved posts grid.
                // In a future step, this would be a dedicated LikedPostsGrid component.
                return <SavedPostsGrid userId={user.uid} />;
            case 'privacy':
                return <PrivacySettings />;
            default:
                return null;
        }
    }

    return (
        <main className="min-h-screen bg-background pt-14">
            <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                       <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    </aside>
                    <div className="md:col-span-3">
                        <Card className="min-h-[60vh]">
                            <CardContent className="p-2 sm:p-4 md:p-6">
                                {renderContent()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    );
}
