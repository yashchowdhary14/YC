'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Bell, MessageCircle, Heart, UserPlus, Video, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationSettingsPage() {
    const router = useRouter();

    const [settings, setSettings] = useState({
        // Push Notifications
        pushEnabled: true,
        likes: true,
        comments: true,
        newFollowers: true,
        mentions: true,
        directMessages: true,
        liveVideos: true,

        // Email Notifications
        emailEnabled: true,
        emailDigest: true,
        emailReminders: false,
        emailProductUpdates: false,

        // In-App Notifications
        soundEnabled: true,
        vibrationEnabled: true,
    });

    const handleToggle = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    return (
        <div className="min-h-screen bg-background pt-14">
            <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/account/edit">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">Notification Settings</h1>
                </div>

                <div className="space-y-8">
                    {/* Push Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <h3 className="font-semibold">Push Notifications</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications on this device
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.pushEnabled}
                                onCheckedChange={() => handleToggle('pushEnabled')}
                            />
                        </div>

                        {settings.pushEnabled && (
                            <div className="ml-8 space-y-4 pl-4 border-l-2 border-muted">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-muted-foreground" />
                                        <Label>Likes</Label>
                                    </div>
                                    <Switch
                                        checked={settings.likes}
                                        onCheckedChange={() => handleToggle('likes')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                        <Label>Comments</Label>
                                    </div>
                                    <Switch
                                        checked={settings.comments}
                                        onCheckedChange={() => handleToggle('comments')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                                        <Label>New Followers</Label>
                                    </div>
                                    <Switch
                                        checked={settings.newFollowers}
                                        onCheckedChange={() => handleToggle('newFollowers')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                        <Label>Mentions</Label>
                                    </div>
                                    <Switch
                                        checked={settings.mentions}
                                        onCheckedChange={() => handleToggle('mentions')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                        <Label>Direct Messages</Label>
                                    </div>
                                    <Switch
                                        checked={settings.directMessages}
                                        onCheckedChange={() => handleToggle('directMessages')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4 text-muted-foreground" />
                                        <Label>Live Videos</Label>
                                    </div>
                                    <Switch
                                        checked={settings.liveVideos}
                                        onCheckedChange={() => handleToggle('liveVideos')}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Email Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Email Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    Receive notifications via email
                                </p>
                            </div>
                            <Switch
                                checked={settings.emailEnabled}
                                onCheckedChange={() => handleToggle('emailEnabled')}
                            />
                        </div>

                        {settings.emailEnabled && (
                            <div className="ml-8 space-y-4 pl-4 border-l-2 border-muted">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Weekly Digest</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Summary of your activity
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.emailDigest}
                                        onCheckedChange={() => handleToggle('emailDigest')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Reminders</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Notifications you may have missed
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.emailReminders}
                                        onCheckedChange={() => handleToggle('emailReminders')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Product Updates</Label>
                                        <p className="text-xs text-muted-foreground">
                                            New features and improvements
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.emailProductUpdates}
                                        onCheckedChange={() => handleToggle('emailProductUpdates')}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* In-App Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">In-App Settings</h3>
                        </div>

                        <div className="ml-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Sound</Label>
                                <Switch
                                    checked={settings.soundEnabled}
                                    onCheckedChange={() => handleToggle('soundEnabled')}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Vibration</Label>
                                <Switch
                                    checked={settings.vibrationEnabled}
                                    onCheckedChange={() => handleToggle('vibrationEnabled')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <Button
                            className="w-full"
                            onClick={() => {
                                // TODO: Save to Firebase
                                router.push('/account/edit');
                            }}
                        >
                            Save Preferences
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
