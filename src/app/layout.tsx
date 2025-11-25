import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

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
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <h1 className="text-2xl font-bold p-2 px-4 font-serif">Instagram</h1>
              </SidebarHeader>
              <SidebarContent>
                <SidebarNav />
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <AppHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
