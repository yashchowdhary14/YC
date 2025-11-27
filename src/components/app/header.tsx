
'use client';

import { Heart, Search, Bell } from 'lucide-react';
import { CreateButton } from '../create';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';

export default function AppHeader({ onNewPostClick }: { onNewPostClick: () => void; }) {
  const { user } = useUser();

  return (
    <header className="bg-background/95 backdrop-blur-sm text-foreground p-3 px-6 flex justify-between items-center border-b sticky top-0 z-50">
      {/* Logo (Mobile/Tablet only - hidden on large desktop where sidebar is present) */}
      <h1 className="text-2xl font-serif font-instagram lg:hidden">YCP</h1>

      {/* Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search"
          className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all focus:bg-background"
        />

        {/* Search Results Dropdown (Mock) */}
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 translate-y-2 group-focus-within:translate-y-0 z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Recent</div>
            {['johndoe', 'creative_studio', 'travel_life'].map(user => (
              <div key={user} className="flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user}</p>
                  <p className="text-xs text-muted-foreground">User • 2.5M followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
        <CreateButton onClick={onNewPostClick} />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu (Desktop) */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/profile" className="cursor-pointer">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/account/edit" className="cursor-pointer">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/studio" className="cursor-pointer">Studio</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
