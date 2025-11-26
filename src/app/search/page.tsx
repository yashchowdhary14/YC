
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post, User as UserType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dummyUsers, dummyPosts } from '@/lib/dummy-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SearchPost extends Omit<Post, 'user'> {
    type: 'photo' | 'video' | 'reel';
    span: 'row-span-1' | 'row-span-2' | 'col-span-1' | 'col-span-2';
}

function PostCard({ post }: { post: SearchPost }) {
    const isVideo = post.type === 'video' || post.type === 'reel';
    return (
        <Link href={`/p/${post.id}`}>
        <div
            className={cn(
            'group relative aspect-square w-full overflow-hidden rounded-md',
            post.span
            )}
        >
            <Image
                src={post.imageUrl}
                alt={post.caption || 'Explore page post'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {isVideo && (
                <PlayCircle className="h-12 w-12 text-white" />
            )}
            </div>
        </div>
        </Link>
    );
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return dummyUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10);
    }, [searchTerm]);

    const searchPosts: SearchPost[] = useMemo(() => {
        return dummyPosts.map((post, index) => {
            const image = PlaceHolderImages.find(img => img.id === post.imageId)!;
            let type: SearchPost['type'] = 'photo';
            let span: SearchPost['span'] = 'col-span-1';

            if(index % 7 === 0) {
                type = 'reel';
                span = 'row-span-2';
            } else if (index % 11 === 0) {
                span = 'col-span-2';
            } else if(index % 5 === 0) {
                span = 'row-span-2';
            }

            return {
                ...post,
                imageUrl: image.imageUrl,
                imageHint: image.imageHint,
                type,
                span,
            };
        });
    }, []);

    const showSearchResults = isFocused && searchTerm.length > 0;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="bg-background min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <div className="sticky top-[calc(4rem+1px)] z-20 bg-background py-4 mb-4 -mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="w-full rounded-lg bg-muted pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                 {showSearchResults && (
                    <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-30 shadow-lg">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <Link href={`/${user.username}`} key={user.id}>
                                    <div className="flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer">
                                        <Avatar>
                                            <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} alt={user.username} />
                                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{user.username}</p>
                                            <p className="text-xs text-muted-foreground">{user.fullName}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                           <div className="p-4 text-center text-sm text-muted-foreground">
                                No users found for &quot;{searchTerm}&quot;.
                            </div>
                        )}
                    </Card>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-1 auto-rows-fr">
                {searchPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
