import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import { Sidebar, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';

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
              <Sidebar>
                <SidebarHeader>
                  <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarNav />
                </SidebarContent>
              </Sidebar>
              <AppHeader />
              <main>{children}</main>
            </div>
          </SidebarProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
