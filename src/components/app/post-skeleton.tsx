import { Skeleton } from '@/components/ui/skeleton';

export function PostSkeleton() {
    return (
        <div className="mb-4 border-b pb-2">
            {/* Header */}
            <div className="flex items-center justify-between p-2 px-4">
                <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="grid gap-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Media */}
            <div className="relative aspect-square bg-muted">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Actions */}
            <div className="flex justify-between p-2 px-3">
                <div className="flex space-x-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-8 w-8" />
            </div>

            {/* Likes and Caption */}
            <div className="px-4 pb-2 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}
