'use client';

interface StatsRowProps {
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export default function StatsRow({ stats }: StatsRowProps) {
  const statItems = [
    { label: 'posts', value: stats.posts },
    { label: 'followers', value: stats.followers },
    { label: 'following', value: stats.following },
  ];

  // Helper function to format large numbers
  const formatStat = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
  };

  return (
    <div className="flex justify-around text-center">
      {statItems.map((item) => (
        <button
          key={item.label}
          className="flex flex-col items-center rounded-md px-4 py-2 text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="text-lg font-semibold">
            {formatStat(item.value)}
          </span>
          <span className="text-muted-foreground">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
