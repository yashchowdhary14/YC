
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Placeholder components
const LikesActivity = () => <div className="p-4 text-center text-muted-foreground">Likes activity coming soon.</div>;
const CommentsActivity = () => <div className="p-4 text-center text-muted-foreground">Comments activity coming soon.</div>;
const ReviewsActivity = () => <div className="p-4 text-center text-muted-foreground">Reviews activity coming soon.</div>;


export default function InteractionsActivity() {
    return (
        <Tabs defaultValue="likes" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="likes">Likes</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="likes">
                <LikesActivity />
            </TabsContent>
            <TabsContent value="comments">
                <CommentsActivity />
            </TabsContent>
            <TabsContent value="reviews">
                <ReviewsActivity />
            </TabsContent>
        </Tabs>
    )
}

    