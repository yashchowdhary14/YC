
'use client';

import {
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  User,
  Clapperboard,
  Video,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';


const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/live', label: 'Explore', icon: Compass },
  { href: '/reels', label: 'Reels', icon: Clapperboard },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/messages', label: 'Messages', icon: MessageCircle, notificationCount: 5 },
  { href: '/create', label: 'Create', icon: PlusSquare },
];

interface SidebarNavProps {
    isCollapsed?: boolean;
}

export default function SidebarNav({ isCollapsed = false }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const allLinks = [
    ...mainLinks,
    { href: '/profile', label: 'Profile', icon: user ? () => (
      <Avatar className={cn("h-6 w-6", pathname === '/profile' && "ring-2 ring-foreground")}>
        <AvatarImage src={user.photoURL || ''} />
        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    ) : User },
  ];

  if (isCollapsed) {
    return (
        <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col h-full items-center">
                <ul className="flex-1 space-y-2">
                    {allLinks.map((link) => (
                    <li key={link.href}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full justify-center gap-4 p-3 text-base h-auto aspect-square",
                                    pathname === link.href ? 'bg-accent' : ''
                                )}
                                >
                                <NextLink href={link.href} className="flex items-center">
                                    <link.icon className={cn("h-6 w-6", pathname === link.href && "font-extrabold")} />
                                </NextLink>
                                </Button>
                            </TooltipTrigger>
                             <TooltipContent side="right" className="ml-2">
                                <p>{link.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </li>
                    ))}
                </ul>
            </nav>
        </TooltipProvider>
    )
  }

  return (
    <nav className="flex flex-col h-full px-2">
      <ul className="flex-1 space-y-1">
        {allLinks.map((link) => (
          <li key={link.href}>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-3 py-6 text-base h-auto",
                pathname === link.href ? 'font-bold' : ''
              )}
            >
              <NextLink href={link.href} className="flex items-center">
                <link.icon className="h-6 w-6" />
                <span className="ml-4">{link.label}</span>
                {link.href === '/messages' && link.notificationCount && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {link.notificationCount}
                    </span>
                )}
              </NextLink>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
