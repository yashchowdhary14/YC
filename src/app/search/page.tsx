'use client';

import { useState } from 'react';
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types'; // Assuming a generic Post type for now.

// Extend the Post type for our search grid needs
interface SearchPost extends Post {
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
            post.span,
            post.type === 'reel' && 'aspect-[9/16]',
            post.type === 'video' && 'col-span-2 aspect-video',
            'col-span-1 row-span-1' // Default
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
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');

    const postsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(25)) : null),
        [firestore]
    );

    const { data: postsData, isLoading } = useCollection(postsQuery);
    
    // Assign random spans and types for masonry effect
    const searchPosts: SearchPost[] = (postsData || []).map((post, index) => {
        let type: SearchPost['type'] = 'photo';
        let span: SearchPost['span'] = 'col-span-1';

        // Add some variety to the grid layout
        if(index % 7 === 0) {
            type = 'reel';
            span = 'row-span-2';
        } else if (index % 11 === 0) {
            type = 'video';
            span = 'col-span-2';
        } else if(index % 5 === 0) {
            span = 'row-span-2';
        } else if (index % 9 === 0) {
            span = 'col-span-2'
        }

        return {
            ...post,
            type,
            span
        } as SearchPost;
    });


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
            <div className="sticky top-[calc(4rem+1px)] z-10 bg-background py-4 mb-4 -mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="w-full rounded-lg bg-muted pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-1 auto-rows-fr">
                {searchPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
             { !isLoading && searchPosts.length === 0 && (
                 <div className="text-center text-muted-foreground py-16">
                     <p>No posts to display.</p>
                </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
