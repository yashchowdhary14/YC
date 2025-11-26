
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/live/category/${category.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-zinc-800">
        <AspectRatio ratio={3 / 4}>
          <Image
            src={category.thumbnailUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
          />
        </AspectRatio>
      </div>
      <h3 className="mt-2 font-semibold truncate text-white group-hover:text-primary">{category.name}</h3>
    </Link>
  );
}
