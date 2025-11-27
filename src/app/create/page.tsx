
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusSquare, Clapperboard, Video, Wifi, Camera } from 'lucide-react';

const creationOptions = [
  {
    href: '/create/story',
    title: 'Story',
    description: 'Share a fleeting moment that disappears.',
    icon: (
        <Camera width="32" height="32" />
    ),
    color: 'from-purple-500 to-indigo-500',
  },
  {
    href: '/create/post',
    title: 'Post',
    description: 'Share a photo or text with your followers.',
    icon: (
        <PlusSquare width="32" height="32" />
    ),
    color: 'from-pink-500 to-rose-500',
  },
  {
    href: '/create/video',
    title: 'Reel',
    description: 'Create and share short, fun videos.',
    icon: (
       <Clapperboard width="32" height="32" />
    ),
    color: 'from-cyan-500 to-blue-500',
  },
  {
    href: '/create/video', // This will now open the generic video creator
    title: 'Video',
    description: 'Upload and share a long-form video.',
    icon: (
        <Video width="32" height="32" />
    ),
    color: 'from-emerald-500 to-green-500',
  },
  {
    href: '/studio/broadcast',
    title: 'Go Live',
    description: 'Stream directly to your audience now.',
    icon: (
      <Wifi width="32" height="32" />
    ),
    color: 'from-red-500 to-orange-500',
  },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function CreatePage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-background pt-14 min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-lg mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-10"
        >
            <h1 className="text-4xl font-bold tracking-tight">Create</h1>
            <p className="text-muted-foreground mt-2 text-lg">What would you like to share today?</p>
        </motion.div>

        <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {creationOptions.map((option) => (
                <Link href={option.href} key={option.href} passHref>
                    <motion.div
                        className="flex items-center gap-6 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors duration-200 cursor-pointer overflow-hidden relative"
                        variants={itemVariants}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-gradient-to-br ${option.color} text-white shadow-lg`}>
                            {option.icon}
                        </div>
                        <div className="flex-grow">
                            <h2 className="font-semibold text-lg text-foreground">{option.title}</h2>
                            <p className="text-muted-foreground text-sm">{option.description}</p>
                        </div>
                         <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${option.color} opacity-10 blur-xl`}></div>
                    </motion.div>
                </Link>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
