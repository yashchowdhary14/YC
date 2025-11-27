'use client';

import { useForm, zodResolver } from '@mantine/form';
import * as z from 'zod';
import { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EditProfileFormProps {
    user: FirebaseUser;
    appUser: AppUser;
}

const formSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    bio: z.string().max(150, 'Bio must be 150 characters or less').optional(),
});

export default function EditProfileForm({ user, appUser }: EditProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm({
        initialValues: {
            fullName: appUser.fullName || '',
            username: appUser.username || '',
            bio: appUser.bio || '',
        },
        validate: zodResolver(formSchema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        setIsLoading(true);
        // Simulate update
        await new Promise(res => setTimeout(res, 1000));
        console.log('Updating profile with:', values);
        toast({ title: 'Profile Updated!', description: 'Your changes have been saved.' });
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={appUser.avatarUrl} />
                        <AvatarFallback>{appUser.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{appUser.username}</p>
                        <Button variant="link" className="p-0 h-auto text-primary">Change profile photo</Button>
                    </div>
                </div>

                <div>
                    <Label htmlFor="fullName">Name</Label>
                    <Input id="fullName" {...form.getInputProps('fullName')} />
                    {form.errors.fullName && <p className="text-destructive text-sm mt-1">{form.errors.fullName}</p>}
                </div>
                
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...form.getInputProps('username')} />
                     {form.errors.username && <p className="text-destructive text-sm mt-1">{form.errors.username}</p>}
                </div>

                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" {...form.getInputProps('bio')} />
                     {form.errors.bio && <p className="text-destructive text-sm mt-1">{form.errors.bio}</p>}
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
