'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from './ui/wallet-multi-button';
import { Clock, Clock3, LockIcon, SendIcon, UnlockIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Hero() {
  const { connected } = useWallet();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="relative">
          <Clock3 className="h-20 w-20 mx-auto mb-6 text-secondary float-animation" strokeWidth={1.25} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Chrono Vault
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-6 text-muted-foreground max-w-2xl mx-auto">
          Store your cherished memories in time capsules and rediscover them in the future
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {connected ? (
          <Button 
            size="lg"
            className="py-6 px-8 text-lg"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        ) : (
          <div className="inline-block">
            <WalletMultiButton className="py-6 px-8 text-lg" />
          </div>
        )}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        <div className="capsule-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <SendIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Create</h3>
          <p className="text-muted-foreground">Upload messages, images, videos and set a future unlock date</p>
        </div>
        
        <div className="capsule-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
            <LockIcon className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Lock</h3>
          <p className="text-muted-foreground">Your time capsule remains securely locked until the specified date</p>
        </div>
        
        <div className="capsule-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <UnlockIcon className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-xl font-bold mb-2">Discover</h3>
          <p className="text-muted-foreground">Rediscover your memories when the unlock date arrives</p>
        </div>
      </motion.div>
    </div>
  );
}