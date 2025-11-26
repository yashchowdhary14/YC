
'use client';

import { Home, Search, Clapperboard } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LiveIcon } from '../icons/live-icon';

const navLinks = [
  { href: '/', icon: Home, activeIcon: (props: any) => <svg {...props} aria-label="Home" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg> },
  { href: '/explore', icon: Search, activeIcon: (props: any) => <svg {...props} aria-label="Search" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg> },
  { href: '/reels', icon: Clapperboard, activeIcon: (props: any) => <svg {...props} aria-label="Reels" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a10 10 0 1 0 10 10 10.012 10.012 0 0 0-10-10Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></path><path d="m12.003 16.001-4-4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15.003 12.001h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> },
  { href: '/live', icon: LiveIcon, activeIcon: (props: any) => <LiveIcon {...props} /> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-background border-t z-50 md:hidden">
      <nav className="flex h-full items-center justify-around text-foreground">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const IconComponent = isActive ? link.activeIcon : link.icon;
          return (
            <NextLink key={link.href} href={link.href} passHref>
              <Button variant="ghost" size="icon" className="h-full w-auto px-4 text-foreground">
                <IconComponent className={cn("h-6 w-6", isActive && 'fill-foreground')} />
              </Button>
            </NextLink>
          );
        })}
        {user && (
          <NextLink href="/" passHref>
            <Button variant="ghost" size="icon" className="h-full w-auto px-4 text-foreground">
              <Avatar className={cn("h-6 w-6")}>
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </NextLink>
        )}
      </nav>
    </div>
  );
}
