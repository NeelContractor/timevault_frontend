'use client';

import { formatDistanceToNow, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Capsule } from '@/types/capsule';
import { Eye, FileIcon, ImageIcon, LockIcon, TimerIcon, UnlockIcon, VideoIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

type TimeCapsuleListProps = {
  capsules: Capsule[];
  loading: boolean;
};

export function TimeCapsuleList({ capsules, loading }: TimeCapsuleListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="backdrop-blur-sm bg-black/20 border border-white/10">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (capsules.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <LockIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-medium text-muted-foreground mb-2">No Time Capsules Yet</h3>
        <p className="text-muted-foreground mb-6">Create your first time capsule to get started</p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {capsules.map((capsule) => {
        const isUnlocked = isPast(new Date(capsule.unlockTime));
        
        return (
          <motion.div key={capsule.id} variants={item}>
            <Card 
              className={`overflow-hidden h-full backdrop-blur-sm bg-black/20 border hover:shadow-md transition-all ${
                isUnlocked ? 'capsule-unlocked' : 'capsule-locked'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{capsule.title}</CardTitle>
                  {isUnlocked ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                      <UnlockIcon className="h-3 w-3" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      <LockIcon className="h-3 w-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4 h-28 overflow-hidden rounded-md bg-muted/30 flex items-center justify-center">
                  {capsule.mediaType === 'image' ? (
                    <ImageIcon className="h-10 w-10 text-muted-foreground opacity-70" />
                  ) : capsule.mediaType === 'video' ? (
                    <VideoIcon className="h-10 w-10 text-muted-foreground opacity-70" />
                  ) : capsule.message ? (
                    <div className="text-muted-foreground px-3 py-2 text-sm line-clamp-4 overflow-hidden">
                      {capsule.message}
                    </div>
                  ) : (
                    <FileIcon className="h-10 w-10 text-muted-foreground opacity-70" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TimerIcon className="h-4 w-4" />
                  <span>
                    {/* {isUnlocked
                      ? `Unlocked ${formatDistanceToNow(new Date(capsule.unlockTime.getHours()))} ago`
                      : `Unlocks in ${formatDistanceToNow(new Date(capsule.unlockTime.getHours()))}`} */}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={isUnlocked ? "default" : "secondary"}
                  className="w-full gap-2"
                  onClick={() => router.push(`/dashboard/capsule/${capsule.id}`)}
                >
                  <Eye className="h-4 w-4" />
                  {isUnlocked ? 'View Capsule' : 'View Details'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}