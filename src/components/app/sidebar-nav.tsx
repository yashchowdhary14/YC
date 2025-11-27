
'use client';

import {
  Compass,
  Home,
  MessageCircle,
  PlusSquare,
  Clapperboard,
  Video,
  Search,
  UserCircle,
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
import { LiveIcon } from '../icons/live-icon';


const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/reels', label: 'Reels', icon: Clapperboard },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/live', label: 'Live', icon: LiveIcon },
  { href: '/messages', label: 'Messages', icon: MessageCircle, notificationCount: 5 },
  { href: '/create', label: 'Create', icon: PlusSquare },
];

interface SidebarNavProps {
<<<<<<< HEAD
  isCollapsed?: boolean;
=======
    isCollapsed?: boolean;
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
}

export default function SidebarNav({ isCollapsed = false }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

<<<<<<< HEAD
  const profileLink = user ? {
    href: `/profile`, label: 'Profile', icon: (props: any) => (
      <Avatar {...props}>
        <AvatarImage src={user.photoURL || ''} />
        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    )
  } : null;
=======
  const profileLink = user ? { href: `/profile`, label: 'Profile', icon: (props: any) => (
      <Avatar {...props}>
          <AvatarImage src={user.photoURL || ''} />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
  ) } : null;
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c

  const allLinks = [
    ...mainLinks,
  ];

<<<<<<< HEAD
  if (profileLink) {
=======
  if(profileLink){
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    allLinks.push(profileLink);
  }

  if (isCollapsed) {
    return (
<<<<<<< HEAD
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col h-full items-center">
          <ul className="flex-1 space-y-2">
            {allLinks.map((link) => {
              const isActive = (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href;
              return (
                <li key={link.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full justify-center gap-4 p-3 text-base h-auto aspect-square text-foreground transition-all duration-200 ease-in-out hover:scale-105 hover:bg-accent/50",
                          isActive && 'bg-accent/20 shadow-[0_0_15px_rgba(330,80%,58%,0.3)]'
                        )}
                      >
                        <NextLink href={link.href} className="flex items-center text-foreground">
                          <link.icon className={cn("h-6 w-6 transition-all duration-200", isActive && "scale-110 font-extrabold")} />
                        </NextLink>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>
      </TooltipProvider>
=======
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
                                    "w-full justify-center gap-4 p-3 text-base h-auto aspect-square text-foreground",
                                    (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? 'bg-accent' : ''
                                )}
                                >
                                <NextLink href={link.href} className="flex items-center text-foreground">
                                    <link.icon className={cn("h-6 w-6", (pathname.startsWith(link.href) && link.href !== '/') || (pathname === link.href) && "font-extrabold")} />
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
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    )
  }

  return (
    <nav className="flex flex-col h-full px-2">
      <ul className="flex-1 space-y-1">
<<<<<<< HEAD
        {allLinks.map((link) => {
          const isActive = ((pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href) && link.href !== '/create';
          return (
            <li key={link.href}>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 px-3 py-6 text-base h-auto text-foreground transition-all duration-200 ease-in-out hover:bg-accent/50 hover:translate-x-1 group",
                  isActive && 'font-bold bg-accent/20 shadow-[0_0_15px_rgba(330,80%,58%,0.2)]'
                )}
              >
                <NextLink href={link.href} className="flex items-center text-foreground w-full">
                  <link.icon className={cn("h-6 w-6 transition-all duration-200 group-hover:scale-110", isActive && "scale-105")} />
                  <span className={cn("ml-4 transition-all duration-200", isActive && "tracking-wide")}>{link.label}</span>
                  {link.href === '/messages' && link.notificationCount && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                      {link.notificationCount}
                    </span>
                  )}
                </NextLink>
              </Button>
            </li>
          )
        })}
=======
        {allLinks.map((link) => (
          <li key={link.href}>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-3 py-6 text-base h-auto text-foreground",
                ((pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href) && link.href !== '/create' ? 'font-bold' : ''
              )}
            >
              <NextLink href={link.href} className="flex items-center text-foreground">
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
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
      </ul>
    </nav>
  );
}
