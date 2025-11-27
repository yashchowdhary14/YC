
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { dummyUsers } from '@/lib/dummy-data';
import { Search } from 'lucide-react';

interface TagPeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  taggedUsers: string[];
  setTaggedUsers: (users: string[]) => void;
}

export default function TagPeopleModal({ isOpen, onClose, taggedUsers, setTaggedUsers }: TagPeopleModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = dummyUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleUser = (username: string) => {
    const isTagged = taggedUsers.includes(username);
    if (isTagged) {
        setTaggedUsers(taggedUsers.filter(u => u !== username));
    } else {
        setTaggedUsers([...taggedUsers, username]);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>Tag people</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for people" 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6 space-y-1">
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                onClick={() => handleToggleUser(user.username)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.fullName}</p>
                </div>
                <Checkbox 
                  checked={taggedUsers.includes(user.username)} 
                  onCheckedChange={() => handleToggleUser(user.username)}
                  aria-label={`Tag ${user.username}`}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
