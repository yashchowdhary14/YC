
'use client';

import { useState, useOptimistic, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion, MotionValue } from 'framer-motion';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    profilePhoto: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    verified: boolean;
  };
  onEditClick: () => void;
  onMessageClick?: () => void;
  isNavigatingToChat?: boolean;
  isCurrentUser?: boolean;
  animatedAvatar: {
    scale: MotionValue<number>;
    y: MotionValue<number>;
  };
  animatedHeader: {
    opacity: MotionValue<number>;
  };
}

const ProfileStats = ({ user, optimisticFollowers }: { user: ProfileHeaderProps['user'], optimisticFollowers: number }) => (
    <div className="hidden md:flex items-center gap-6 text-base text-foreground">
        <span><span className="font-semibold">{user.postsCount}</span> posts</span>
        <button><span className="font-semibold">{optimisticFollowers.toLocaleString()}</span> followers</button>
        <Link href="/following" passHref>
        <button><span className="font-semibold">{user.followingCount.toLocaleString()}</span> following</button>
        </Link>
    </div>
);

const ProfileBio = ({ user }: { user: ProfileHeaderProps['user']}) => {
    const renderBio = (bio: string) => {
        if (!bio) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = bio.split(urlRegex);
        return parts.map((part, index) =>
        urlRegex.test(part)
            ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{part}</a>
            : part
        );
    };

    return (
        <div className="hidden md:block text-sm">
            <p className="font-semibold">{user.fullName}</p>
            <p className="whitespace-pre-wrap">{renderBio(user.bio)}</p>
        </div>
    );
}

export default function ProfileHeader({
  user,
  onEditClick,
  onMessageClick,
  isNavigatingToChat = false,
  isCurrentUser = false,
  animatedAvatar,
  animatedHeader,
}: ProfileHeaderProps) {
  const { user: currentUser, followedUsers, toggleFollow } = useUser();
  const { toast } = useToast();

  const isFollowing = followedUsers.has(user.username);
  
  const [optimisticFollowers, setOptimisticFollowers] = useState(user.followersCount);

  useEffect(() => {
    setOptimisticFollowers(user.followersCount);
  }, [user.followersCount]);

  const handleFollowToggle = () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "You must be logged in to follow users." });
      return;
    }
    setOptimisticFollowers(prev => isFollowing ? prev - 1 : prev + 1);
    toggleFollow(user.username);
  };

  return (
    <header className="flex gap-4 md:gap-16 items-start w-full">
      <motion.div 
        className="flex-shrink-0 w-20 h-20 md:w-36 md:h-36"
        style={{ scale: animatedAvatar.scale, y: animatedAvatar.y, originX: 0 }}
      >
        <Avatar className="h-full w-full">
          <AvatarImage src={user.profilePhoto} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </motion.div>

      <motion.div 
        className="flex flex-col gap-4 flex-grow"
        style={{ opacity: animatedHeader.opacity }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal text-foreground">{user.username}</h1>
            {user.verified && <CheckCircle className="h-5 w-5 text-primary fill-current" />}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {isCurrentUser ? (
              <>
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button onClick={onEditClick} variant="secondary" size="sm" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm">
                        Edit profile
                    </Button>
                </motion.div>
                 <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm">
                        View archive
                    </Button>
                </motion.div>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                  <Settings className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button size="sm" variant={isFollowing ? 'secondary' : 'default'} onClick={handleFollowToggle} className="w-full">
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button size="sm" variant="secondary" onClick={onMessageClick} disabled={isNavigatingToChat} className="w-full">
                        {isNavigatingToChat && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Message
                    </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <ProfileStats user={user} optimisticFollowers={optimisticFollowers} />
        <ProfileBio user={user} />
      </motion.div>
    </header>
  );
}
