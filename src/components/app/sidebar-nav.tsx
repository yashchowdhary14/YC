'use client';

import {
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  User,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/create', label: 'Create', icon: PlusSquare },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/notifications', label: 'Notifications', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
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
  );
}
