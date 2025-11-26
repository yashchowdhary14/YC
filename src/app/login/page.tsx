
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dummyUsers } from '@/lib/dummy-data';
import { useUser } from '@/firebase';

export default function LoginPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = () => {
    if (selectedUserId) {
      const userToLogin = dummyUsers.find(u => u.id === selectedUserId);
      if (userToLogin && login) {
        login({
          uid: userToLogin.id,
          displayName: userToLogin.fullName,
          email: `${userToLogin.username}@example.com`,
          photoURL: `https://picsum.photos/seed/${userToLogin.id}/150/150`,
        });
        router.push('/');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 flex items-center gap-2 text-2xl font-semibold">
        <h1 className="text-3xl font-bold font-serif">Instagram</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Select an Account</CardTitle>
          <CardDescription>
            Choose a user to log in and demo the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedUserId} value={selectedUserId || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user..." />
            </SelectTrigger>
            <SelectContent>
              {dummyUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleLogin} className="w-full" disabled={!selectedUserId}>
            Log In
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
