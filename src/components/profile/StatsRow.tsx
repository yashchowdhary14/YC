'use client';

// Placeholder for StatsRow component
export default function StatsRow({ stats }: { stats: any }) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      Stats: {stats.postsCount} posts, {stats.followersCount} followers, {stats.followingCount} following
    </div>
  );
}
