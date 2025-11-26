
'use client';

import { Heart, MessageCircle, PlusSquare } from 'lucide-react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { SidebarTrigger } from '@/components/ui/sidebar';

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
  
  const isHomePage = pathname === '/';

  return (
    <>
    {/* Desktop and Tablet Header */}
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
           <SidebarTrigger className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
           </SidebarTrigger>
          {!isHomePage && (
            <NextLink href="/" className="hidden font-instagram text-2xl font-bold md:block">
              YCP
            </NextLink>
          )}
           {isHomePage && (
             <div className="hidden lg:block w-[180px]">
                <NextLink href="/" passHref>
                    <h1 className="text-2xl font-bold p-2 px-4 font-instagram">YCP</h1>
                </NextLink>
            </div>
          )}
          {children}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Icons remain for desktop header */}
        </div>
      </div>
    </header>

    {/* Mobile Header (Home Page Only) */}
    {isHomePage && (
      <header className="sticky top-0 z-40 w-full bg-background md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="font-instagram text-3xl">YCP</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="text-foreground">
              <NextLink href="/create">
                <PlusSquare />
                <span className="sr-only">Create Post</span>
              </NextLink>
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Heart />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
      </header>
    )}
    </>
  );
}
