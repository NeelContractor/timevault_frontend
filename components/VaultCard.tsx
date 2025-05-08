"use client"
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Lock, Unlock, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export interface VaultData {
  id: string;
  title: string;
  contentType: 'text' | 'image' | 'video' | 'file';
  createdAt: Date;
  unlockTime: Date;
  isUnlocked: boolean;
}

interface VaultCardProps {
  vault: VaultData;
  className?: string;
}

const VaultCard: FC<VaultCardProps> = ({ vault, className }) => {
  const router = useRouter();
  const now = new Date();
  const unlockTime = new Date(vault.unlockTime);
  const isUnlockable = now >= unlockTime;
  
  const getContentTypeIcon = () => {
    switch (vault.contentType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'file':
        return '📄';
      default:
        return '📝';
    }
  };

  const timeRemaining = () => {
    if (isUnlockable) {
      return 'Ready to unlock';
    }
    const diff = unlockTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    }
  };

  return (
    <div
      className={cn(
        'glass-card rounded-xl overflow-hidden border border-vault-accent/30',
        isUnlockable && 'animate-pulse-glow',
        className
      )}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getContentTypeIcon()}</span>
            <h3 className="text-lg font-semibold text-white">{vault.title}</h3>
          </div>
          {isUnlockable ? (
            <Unlock className="h-5 w-5 text-vault-accent" />
          ) : (
            <Lock className="h-5 w-5 text-vault-secondary" />
          )}
        </div>
        
        <div className="space-y-4 flex-grow">
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="h-4 w-4 mr-2 text-vault-secondary" />
            <p>Created: {format(vault.createdAt, 'MMM d, yyyy')}</p>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-400">Unlock date:</span>
            <p className="text-vault-light font-medium">{format(vault.unlockTime, 'MMM d, yyyy - h:mm a')}</p>
          </div>
          
          <div className="mt-2">
            <p className={cn(
              "text-sm font-medium",
              isUnlockable ? "text-vault-accent" : "text-vault-secondary"
            )}>
              {timeRemaining()}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-vault-accent/20">
          <Button
            onClick={() => router.push(`/vault/${vault.id}`)}
            className={cn(
              "w-full",
              isUnlockable 
                ? "bg-vault-accent hover:bg-vault-accent/80" 
                : "bg-vault-dark/50 text-gray-300 hover:bg-vault-dark"
            )}
          >
            {isUnlockable ? 'View Content' : 'View Details'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;