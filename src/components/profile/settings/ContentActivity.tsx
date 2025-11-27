
'use client';

import PostsGrid from '@/components/profile/PostsGrid';
import ReelsGrid from '@/components/profile/ReelsGrid';
import StoryHighlights from '@/components/profile/StoryHighlights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase';

export default function ContentActivity() {
    const { user, appUser } = useUser();
    
    if (!user || !appUser) {
        return <div className="p-4 text-center text-muted-foreground">Please log in to see your content.</div>
    }

    return (
        <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="reels">Reels</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
                <PostsGrid userId={user.uid} />
            </TabsContent>
            <TabsContent value="reels">
                <ReelsGrid userId={user.uid} />
            </TabsContent>
            <TabsContent value="highlights">
                <StoryHighlights profileUser={appUser} />
            </TabsContent>
        </Tabs>
    )
}

    