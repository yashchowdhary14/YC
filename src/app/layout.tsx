import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Sidebar, SidebarHeader as StyledSidebarHeader, SidebarContent as StyledSidebarContent } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Instagram',
  description: 'A modern social media experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <FirebaseClientProvider>
          <SidebarProvider>
            <div className="relative min-h-svh">
              {/* Desktop Sidebars */}
              <div className="fixed left-0 top-0 h-full z-10 hidden lg:flex flex-col border-r bg-background w-72">
                <StyledSidebarHeader>
                  <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
                </StyledSidebarHeader>
                <StyledSidebarContent>
                  <SidebarNav />
                </StyledSidebarContent>
              </div>
              <div className="fixed left-0 top-0 h-full z-10 hidden md:flex lg:hidden flex-col border-r bg-background p-3 gap-4 w-20">
                <div className="p-2">
                  <svg aria-label="Instagram" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M32.8,0.6c-4.3,0-4.8,0-13.6,0C4.9,0.6,0.6,4.9,0.6,19.2c0,8.7,0,9.3,0,13.6c0,14.3,4.3,18.6,18.6,18.6c8.7,0,9.3,0,13.6,0c14.3,0,18.6-4.3,18.6-18.6c0-4.3,0-4.8,0-13.6C51.4,4.9,47.1,0.6,32.8,0.6z M47.4,32.8c0,12.1-3.4,15.4-15.4,15.4c-8.7,0-9.2,0-13.6,0c-12.1,0-15.4-3.4-15.4-15.4c0-8.7,0-9.2,0-13.6c0-12.1,3.4-15.4,15.4-15.4c4.5,0,4.9,0,13.6,0c12.1,0,15.4,3.4,15.4,15.4C47.4,23.6,47.4,24.2,47.4,32.8z"></path><path d="M25.9,12.5c-7.4,0-13.4,6-13.4,13.4s6,13.4,13.4,13.4s13.4-6,13.4-13.4S33.3,12.5,25.9,12.5z M25.9,35.3c-5.2,0-9.4-4.2-9.4-9.4s4.2-9.4,9.4-9.4s9.4,4.2,9.4,9.4S31.1,35.3,25.9,35.3z"></path><circle cx="38.3" cy="11.1" r="3.2"></circle></svg>
                </div>
                <SidebarNav isCollapsed />
              </div>

              {/* Mobile Sliding Sidebar */}
              <Sidebar>
                <StyledSidebarHeader>
                  <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
                </StyledSidebarHeader>
                <StyledSidebarContent>
                  <SidebarNav />
                </StyledSidebarContent>
              </Sidebar>

              <div className="md:ml-20 lg:ml-72">
                <AppHeader />
                <main>{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
