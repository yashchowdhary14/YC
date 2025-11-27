
'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { dummyUsers } from '@/lib/dummy-data';

export function HomeRightSidebar() {
    const { user } = useUser();
    const suggestedUsers = dummyUsers.slice(0, 5);

    return (
        <div className="w-80 space-y-6 py-6">
            {/* Current User Snippet */}
            {user && (
                <div className="flex items-center justify-between">
                    <Link href={`/profile`} className="flex items-center gap-3 group">
                        <Avatar className="h-12 w-12 transition-transform group-hover:scale-105">
                            <AvatarImage src={user.photoURL || ''} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <p className="font-semibold group-hover:text-primary transition-colors">
                                {user.displayName || 'User'}
                            </p>
                            <p className="text-muted-foreground">
                                @{user.email?.split('@')[0]}
                            </p>
                        </div>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Switch
                    </Button>
                </div>
            )}

            {/* Suggested For You */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">Suggested for you</h3>
                    <Button variant="link" size="sm" className="text-xs text-foreground h-auto p-0 hover:no-underline hover:text-primary">
                        See All
                    </Button>
                </div>

                <div className="space-y-4">
                    {suggestedUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between">
                            <Link href={`/${u.username}`} className="flex items-center gap-3 group">
                                <Avatar className="h-10 w-10 transition-transform group-hover:scale-105">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${u.id}`} />
                                    <AvatarFallback>{u.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-semibold group-hover:text-primary transition-colors">{u.username}</p>
                                    <p className="text-xs text-muted-foreground truncate w-32">
                                        Suggested for you
                                    </p>
                                </div>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 h-8 px-2">
                                Follow
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language'].map((link) => (
                        <Link key={link} href="#" className="hover:underline">
                            {link}
                        </Link>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground uppercase">
                    © 2025 YC Social Media
                </p>
            </div>
        </div>
    );
}
