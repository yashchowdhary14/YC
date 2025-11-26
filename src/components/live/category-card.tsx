
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link href={`/live/category/${category.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-zinc-800 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
        <AspectRatio ratio={3 / 4}>
          <Image
            src={category.thumbnailUrl}
            alt={category.name}
            fill
            className={cn(
              "object-cover transition-all duration-500 ease-in-out group-hover:scale-105",
              isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
            )}
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </AspectRatio>
      </div>
      <h3 className="mt-2 font-semibold truncate text-white group-hover:text-primary">{category.name}</h3>
    </Link>
  );
}
