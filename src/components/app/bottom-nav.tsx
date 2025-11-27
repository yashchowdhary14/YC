
'use client';

import { Home, Search, Clapperboard, UserCircle, Video, PlusSquare } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LiveIcon } from '../icons/live-icon';
import { CreateButton } from '../create';

const navLinks = [
  { href: '/', icon: Home, activeIcon: (props: any) => <svg {...props} aria-label="Home" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg> },
  { href: '/explore', icon: Search, activeIcon: (props: any) => <svg {...props} aria-label="Search" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg> },
  { href: '/reels', icon: Clapperboard, activeIcon: (props: any) => <svg {...props} aria-label="Reels" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a10 10 0 1 0 10 10 10.012 10.012 0 0 0-10-10Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></path><path d="m12.003 16.001-4-4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15.003 12.001h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> },
  { href: '/videos', icon: Video, activeIcon: (props: any) => <svg {...props} aria-label="Videos" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 16 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg> },
];

export default function BottomNav({ onNewPostClick }: { onNewPostClick: () => void; }) {
  const pathname = usePathname();
  const { user } = useUser();
  const profileHref = user ? `/profile` : '/login';

  const navItems = [
    ...navLinks.slice(0, 2),
    null, // Placeholder for Create button
    ...navLinks.slice(2),
  ];

  return (
<<<<<<< HEAD
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
=======
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-background border-t z-50 md:hidden">
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
      <nav className="flex h-full items-center justify-around text-foreground">
        {navItems.map((link, index) => {
          if (!link) {
            return (
<<<<<<< HEAD
              <div key="create-button" className="flex flex-col items-center justify-center">
                <CreateButton
                  onClick={onNewPostClick}
                  size="md"
                />
              </div>
=======
              <CreateButton
                key="create-button"
                onClick={onNewPostClick}
                size="md"
              />
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
            );
          }
          const isActive = pathname === link.href;
          const IconComponent = isActive ? link.activeIcon : link.icon;
          return (
            <NextLink key={link.href} href={link.href} passHref>
<<<<<<< HEAD
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-full w-auto px-4 text-foreground transition-all duration-200 ease-in-out relative group",
                  "active:scale-95",
                  isActive && "text-primary"
                )}
              >
                <div className="relative">
                  <IconComponent
                    className={cn(
                      "h-6 w-6 transition-all duration-200",
                      isActive && 'scale-110',
                      !isActive && 'group-hover:scale-105 group-active:scale-95'
                    )}
                  />
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
=======
              <Button variant="ghost" size="icon" className="h-full w-auto px-4 text-foreground">
                <IconComponent className={cn("h-6 w-6", isActive && 'fill-foreground')} />
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
              </Button>
            </NextLink>
          );
        })}
        {user && (
          <NextLink href={profileHref} passHref>
<<<<<<< HEAD
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-full w-auto px-4 text-foreground transition-all duration-200 ease-in-out active:scale-95",
                pathname.startsWith('/profile') && "scale-105"
              )}
            >
              <div className="relative">
                <Avatar className={cn(
                  "h-6 w-6 transition-all duration-200 ring-offset-2 ring-offset-background",
                  pathname.startsWith('/profile') && "ring-2 ring-primary scale-110"
                )}>
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
=======
            <Button variant="ghost" size="icon" className="h-full w-auto px-4 text-foreground">
              <Avatar className={cn("h-6 w-6", pathname.startsWith('/profile') && "border-2 border-foreground")}>
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
            </Button>
          </NextLink>
        )}
      </nav>
    </div>
  );
}
