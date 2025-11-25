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
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/reels', label: 'Reels', icon: Clapperboard },
  { href: '/messages', label: 'Messages', icon: MessageCircle, notificationCount: 5 },
  { href: '/notifications', label: 'Notifications', icon: Heart },
  { href: '/create', label: 'Create', icon: PlusSquare },
];

const bottomLinks = [
    { href: '/threads', label: 'Threads', icon: () => <svg aria-label="Threads" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 1.002a11.002 11.002 0 1 0 11.002 11.002A11.003 11.003 0 0 0 12.003 1.002Zm0 20.004a9.002 9.002 0 1 1 9.002-9.002 9.003 9.003 0 0 1-9.002 9.002ZM8.01 12.005a4 4 0 0 0 4.002 4.002 4 4 0 0 0 4.002-4.002A4 4 0 0 0 8.01 12.005Zm8.004-.002a2.002 2.002 0 1 1-2.002 2.002A2.002 2.002 0 0 1 16.014 12.003Z"></path></svg> },
    { href: '/more', label: 'More', icon: Menu },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const allLinks = [
    ...links,
    { href: '/profile', label: 'Profile', icon: user ? () => (
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.photoURL || ''} />
        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    ) : User },
  ];

  return (
    <nav className="flex flex-col h-full">
      <ul className="flex-1 space-y-2">
        {allLinks.map((link) => (
          <li key={link.href}>
            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start gap-4 p-6 text-base ${pathname === link.href ? 'font-bold' : ''}`}
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
       <ul className="space-y-2">
        {bottomLinks.map((link) => (
          <li key={link.href}>
            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start gap-4 p-6 text-base ${pathname === link.href ? 'font-bold' : ''}`}
            >
              <NextLink href={link.href} className="flex items-center">
                <link.icon className="h-6 w-6" />
                <span className="ml-4">{link.label}</span>
              </NextLink>
            </Button>
          </li>
        ))}
       </ul>
    </nav>
  );
}
