'use client';

interface StatsRowProps {
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export default function StatsRow({ stats }: StatsRowProps) {
  const statItems = [
    { label: 'posts', value: stats.postsCount },
    { label: 'followers', value: stats.followersCount },
    { label: 'following', value: stats.followingCount },
  ];

  return (
    <div className="flex justify-around items-center text-center p-4 border-t border-b sm:border-none sm:p-0">
      {statItems.map((item) => (
        <button
          key={item.label}
          className="flex flex-col items-center justify-center w-full text-sm sm:text-base hover:bg-accent/50 rounded-md p-2 transition-colors"
        >
          <span className="font-semibold text-lg">{item.value.toLocaleString()}</span>
          <span className="text-muted-foreground">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
