'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PrivacySettings() {
    const [isPrivate, setIsPrivate] = useState(false);
    const [showActivity, setShowActivity] = useState(true);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Privacy and Security</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="private-account" className="font-semibold">Private Account</Label>
                        <p className="text-sm text-muted-foreground">When your account is private, only people you approve can see your photos and videos.</p>
                    </div>
                    <Switch
                        id="private-account"
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                    />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                         <Label htmlFor="activity-status" className="font-semibold">Show Activity Status</Label>
                        <p className="text-sm text-muted-foreground">Allow accounts you follow and anyone you message to see when you were last active.</p>
                    </div>
                    <Switch
                        id="activity-status"
                        checked={showActivity}
                        onCheckedChange={setShowActivity}
                    />
                </div>
            </div>
        </div>
    );
}
