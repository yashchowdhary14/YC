
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
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Explore', icon: Compass },
  { href: '/reels', label: 'Reels', icon: Clapperboard },
  { href: '/messages', label: 'Messages', icon: MessageCircle, notificationCount: 5 },
  { href: '/notifications', label: 'Notifications', icon: Heart },
  { href: '/create', label: 'Create', icon: PlusSquare },
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
    </nav>
  );
}
