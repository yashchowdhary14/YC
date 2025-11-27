import { Metadata } from 'next';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const metadata: Metadata = {
    title: 'Privacy & Security Settings',
    description: 'Manage your privacy and security preferences',
};

export default function PrivacySettingsPage() {
    const [isPrivate, setIsPrivate] = useState(false);
    const [showActivity, setShowActivity] = useState(true);
    const [allowMessages, setAllowMessages] = useState(true);

    return (
        <main className="min-h-screen bg-background pt-14">
            <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">Privacy & Security</h1>
                <div className="space-y-6">
                    {/* Account Visibility */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="private-account" className="text-foreground">
                            Private Account
                        </Label>
                        <Switch
                            id="private-account"
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                        />
                    </div>
                    {/* Activity Status */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show-activity" className="text-foreground">
                            Show Activity Status
                        </Label>
                        <Switch
                            id="show-activity"
                            checked={showActivity}
                            onCheckedChange={setShowActivity}
                        />
                    </div>
                    {/* Direct Messages */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="allow-messages" className="text-foreground">
                            Allow Direct Messages from Everyone
                        </Label>
                        <Switch
                            id="allow-messages"
                            checked={allowMessages}
                            onCheckedChange={setAllowMessages}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
