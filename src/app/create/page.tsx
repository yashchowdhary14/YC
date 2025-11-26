
'use client';

import Link from 'next/link';
import { Camera, Video, Clapperboard, BookImage } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const creationOptions = [
  {
    href: '/create/post',
    icon: Camera,
    title: 'Create Post',
    description: 'Share a photo with your followers.',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400'
  },
  {
    href: '/create/story',
    icon: BookImage,
    title: 'Create Story',
    description: 'Share a photo or video that disappears after 24 hours.',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400'
  },
  {
    href: '/reels',
    icon: Clapperboard,
    title: 'Create Reel',
    description: 'Share a short video with your followers.',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400'
  },
  {
    href: '/create/video',
    icon: Video,
    title: 'Upload Video',
    description: 'Share a long-form video.',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400'
  },
];

export default function CreatePage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-background pt-14">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Create</h1>
            <p className="text-muted-foreground mt-2 text-lg">What would you like to share with your community?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {creationOptions.map((option) => (
                <Link href={option.href} key={option.href} className="block group">
                    <Card className={`overflow-hidden h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/10`}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className={`p-4 rounded-full mb-4 ${option.bgColor}`}>
                                <option.icon className={`h-10 w-10 ${option.textColor}`} />
                            </div>
                            <CardTitle className="text-xl mb-1">{option.title}</CardTitle>
                            <CardDescription>{option.description}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
