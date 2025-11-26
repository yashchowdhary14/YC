
'use client';

import AppHeader from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function VideosPage() {
  return (
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
        <main className="min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-4">Videos</h1>
            <div className="flex items-center justify-center h-96 border rounded-lg bg-muted">
              <p className="text-muted-foreground">Videos page content goes here.</p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
