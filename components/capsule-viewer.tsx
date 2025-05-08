'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Capsule } from '@/types/capsule';
import { CalendarIcon, ClockIcon, LockIcon, UnlockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { CountdownTimer } from './countdown-timer';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface CapsuleViewerProps {
  capsule: Capsule;
}

export function CapsuleViewer({ capsule }: CapsuleViewerProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the capsule's unlock time has passed
    const unlockTime = new Date(capsule.unlockTime);
    const now = new Date();
    setIsUnlocked(now >= unlockTime);
  }, [capsule]);

  const handleViewCapsule = () => {
    if (!isUnlocked) {
      toast.error("This time capsule hasn't been unlocked yet");
      return;
    }
    
    setShowContent(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">{capsule.title}</h1>
          {isUnlocked ? (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              <UnlockIcon className="h-4 w-4" />
              <span>Unlocked</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
              <LockIcon className="h-4 w-4" />
              <span>Locked</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Created: {format(new Date(capsule.createdAt), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>Unlocks: {format(new Date(capsule.unlockTime), 'PPP p')}</span>
          </div>
        </div>
      </motion.div>
      
      <Card className="backdrop-blur-sm bg-black/20 border border-white/10 overflow-hidden">
        <CardContent className="p-0">
          {!isUnlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <LockIcon className="h-16 w-16 text-secondary mb-6" strokeWidth={1.25} />
              <h2 className="text-2xl font-bold mb-2">This Time Capsule is Locked</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                The content of this time capsule will be revealed when the unlock time arrives.
              </p>
              
              <div className="w-full max-w-md">
                <CountdownTimer targetDate={new Date(capsule.unlockTime)} onComplete={() => setIsUnlocked(true)} />
              </div>
            </motion.div>
          )}
          
          {isUnlocked && !showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <UnlockIcon className="h-16 w-16 text-accent mb-6" strokeWidth={1.25} />
              <h2 className="text-2xl font-bold mb-2">Time Capsule Unlocked!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Your time capsule is now unlocked and ready to be viewed.
              </p>
              <Button size="lg" onClick={handleViewCapsule}>View Capsule Content</Button>
            </motion.div>
          )}
          
          <AnimatePresence>
            {isUnlocked && showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Capsule Content</h2>
                
                {capsule.message && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Message</h3>
                    <div className="p-4 rounded-md bg-black/30 border border-white/10 whitespace-pre-wrap">
                      {capsule.message}
                    </div>
                  </div>
                )}
                
                {capsule.mediaUrl && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Media</h3>
                    <div className="rounded-md overflow-hidden bg-black/30 border border-white/10">
                      {capsule.mediaType === 'image' && (
                        <img 
                          src={capsule.mediaUrl} 
                          alt="Capsule media" 
                          className="max-w-full h-auto"
                        />
                      )}
                      {capsule.mediaType === 'video' && (
                        <video 
                          src={capsule.mediaUrl} 
                          controls 
                          className="w-full h-auto"
                        />
                      )}
                      {capsule.mediaType === 'audio' && (
                        <audio 
                          src={capsule.mediaUrl} 
                          controls 
                          className="w-full my-4"
                        />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}