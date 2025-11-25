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
  { href: '/reels', label: 'Reels', icon: PlusSquare },
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
            // A real app would use Next's Link component
            // For this demo, we use anchors and check isActive
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            href={link.href}
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <a href="#">
              <link.icon />
              <span>{link.label}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
