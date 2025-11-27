
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
<<<<<<< HEAD
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
=======
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
} from '@/components/ui/form';

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: appUser.fullName || '',
            username: appUser.username || '',
            bio: appUser.bio || '',
        },
    });

<<<<<<< HEAD
    const firestore = useFirestore();

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!firestore) return;
        setIsLoading(true);
        try {
            const userRef = doc(firestore, 'users', appUser.id);
            await updateDoc(userRef, {
                fullName: values.fullName,
                username: values.username,
                bio: values.bio,
            });
            toast({ title: 'Profile Updated!', description: 'Your changes have been saved.' });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update profile. Please try again.' });
        } finally {
            setIsLoading(false);
        }
=======
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        // Simulate update
        await new Promise(res => setTimeout(res, 1000));
        console.log('Updating profile with:', values);
        toast({ title: 'Profile Updated!', description: 'Your changes have been saved.' });
        setIsLoading(false);
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={appUser.avatarUrl} />
                    <AvatarFallback>{appUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{appUser.username}</p>
                    <Button variant="link" className="p-0 h-auto text-primary">Change profile photo</Button>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
<<<<<<< HEAD

=======
                    
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
