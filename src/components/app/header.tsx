
'use client';

import { Heart, MessageCircle, PlusSquare, Search, LogOut, User, Users, PlusCircle } from 'lucide-react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { signOut } from 'firebase/auth';

export default function AppHeader({ children }: { children?: React.ReactNode }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  // On homepage with large sidebar, we don't show the trigger or the logo again.
  const showLogoAndTrigger = pathname !== '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
           <SidebarTrigger className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
           </SidebarTrigger>
          {showLogoAndTrigger && (
            <NextLink href="/" className="hidden font-serif text-2xl font-bold md:block">
              YCP
            </NextLink>
          )}
          {children}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <NextLink href="/create">
              <PlusSquare />
              <span className="sr-only">Create Post</span>
            </NextLink>
          </Button>
          <Button variant="ghost" size="icon">
            <Heart />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <NextLink href="/messages">
              <MessageCircle />
              <span className="sr-only">Messages</span>
            </NextLink>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt={user.displayName || 'user'} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <NextLink href="/profile"><User className="mr-2 h-4 w-4"/>Profile</NextLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <NextLink href="/following"><Users className="mr-2 h-4 w-4"/>Following</NextLink>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild>
                <NextLink href="/login">Log In</NextLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
