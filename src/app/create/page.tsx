
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const creationOptions = [
  {
    href: '/create/post',
    title: 'Post',
    description: 'Share a photo or text with your followers.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
    color: 'from-pink-500 to-rose-500',
  },
  {
    href: '/create/story',
    title: 'Story',
    description: 'Share a fleeting moment that disappears.',
    icon: (
       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10" />
        <path d="m15.5 6-4 4-4-4" />
      </svg>
    ),
    color: 'from-purple-500 to-indigo-500',
  },
  {
    href: '/reels',
    title: 'Reel',
    description: 'Create and share short, fun videos.',
    icon: (
       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </svg>
    ),
    color: 'from-cyan-500 to-blue-500',
  },
  {
    href: '/studio/broadcast',
    title: 'Go Live',
    description: 'Stream directly to your audience now.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3.81a4 4 0 0 1 5.19 5.19" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M8 3.81a4 4 0 0 0-5.19 5.19" />
        <path d="M12 22a10 10 0 0 1-10-10" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
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
