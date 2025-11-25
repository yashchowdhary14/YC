import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import SidebarNav from '@/components/app/sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

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
          <div className="flex min-h-screen">
            <aside className="fixed left-0 top-0 z-10 hidden h-full w-[260px] flex-col border-r border-zinc-800 p-4 md:flex">
              <h1 className="text-2xl font-bold p-2 px-4 font-serif mb-8">Instagram</h1>
              <div className="flex-1">
                <SidebarNav />
              </div>
              <div>
                 <p className="px-4 text-xs text-zinc-500">Also from Meta</p>
              </div>
            </aside>
            <main className="flex-1 md:ml-[260px]">
              {children}
            </main>
          </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
