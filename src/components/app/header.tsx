
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
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { dummyUsers } from '@/lib/dummy-data';

export default function AppHeader() {
  const { user, logout, login } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };
  
  const handleSwitchUser = (userId: string) => {
    const userToSwitch = dummyUsers.find(u => u.id === userId);
    if(userToSwitch && login) {
        login({
          uid: userToSwitch.id,
          displayName: userToSwitch.fullName,
          email: `${userToSwitch.username}@example.com`,
          photoURL: `https://picsum.photos/seed/${userToSwitch.id}/150/150`,
        });
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="md:hidden">
            <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </SidebarTrigger>
          </div>
          <NextLink href="/" className="hidden font-serif text-2xl font-bold md:block">
            Instagram
          </NextLink>
        </div>

        <div className="relative hidden w-full max-w-xs items-center md:block">
          <NextLink href="/search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 cursor-pointer" readOnly/>
          </NextLink>
        </div>

        <div className="flex items-center gap-2">
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
          {user && (
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
                    <DropdownMenuLabel>Switch Accounts</DropdownMenuLabel>
                    {dummyUsers.filter(u => u.id !== user.uid).slice(0,3).map(u => (
                         <DropdownMenuItem key={u.id} onSelect={() => handleSwitchUser(u.id)}>
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={`https://picsum.photos/seed/${u.id}/100/100`} />
                                <AvatarFallback>{u.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{u.username}</p>
                                <p className="text-xs text-muted-foreground">{u.fullName}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onSelect={() => router.push('/login')}>
                        <PlusCircle className="mr-2 h-5 w-5"/>
                        Add Account
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <NextLink href="/profile"><User className="mr-2 h-4 w-4"/>Profile</NextLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4"/>
                        <span>Following</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
