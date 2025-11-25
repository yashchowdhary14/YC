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
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/reels', label: 'Reels', icon: Clapperboard },
  { href: '/messages', label: 'Messages', icon: MessageCircle, notificationCount: 4 },
  { href: '/notifications', label: 'Notifications', icon: Heart },
  { href: '/create', label: 'Create', icon: PlusSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

const bottomLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/more', label: 'More', icon: Menu },
]

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
        <SidebarMenu className="flex-1">
        {links.map((link) => (
            <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
                className="relative"
            >
                <NextLink href={link.href}>
                <link.icon className={pathname === link.href ? 'font-bold' : ''} />
                <span className={pathname === link.href ? 'font-bold' : ''}>{link.label}</span>
                {link.notificationCount && (
                    <span className="absolute left-7 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {link.notificationCount}
                    </span>
                )}
                </NextLink>
            </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
        </SidebarMenu>
        <SidebarMenu>
             {bottomLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={link.label}
                >
                    <NextLink href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                    </NextLink>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    </div>
  );
}
