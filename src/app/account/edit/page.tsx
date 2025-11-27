
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';

import DashboardNav from '@/components/account/DashboardNav';
import EditProfileForm from '@/components/account/EditProfileForm';
import PrivacySettings from '@/components/account/PrivacySettings';
import SavedPostsGrid from '@/components/profile/SavedPostsGrid';
import { Card, CardContent } from '@/components/ui/card';

export type ActiveTab = 'edit' | 'saved' | 'privacy' | 'liked';

export default function AccountEditPage() {
    const { user, appUser, isUserLoading } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ActiveTab>('edit');

    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

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
    );
}
