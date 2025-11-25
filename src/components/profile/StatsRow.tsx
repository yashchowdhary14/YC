'use client';

// Placeholder for StatsRow component
export default function StatsRow({ stats }: { stats: any }) {
  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground">
      Stats Row: {stats.posts} posts, {stats.followers} followers, {stats.following} following
    </div>
  );
}
