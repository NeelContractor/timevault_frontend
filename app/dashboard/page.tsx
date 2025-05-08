"use client"

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Lock, Unlock, Clock, Plus, AlertTriangle } from 'lucide-react';
import Layout from "@/components/Layout";
import { VaultData } from "@/components/VaultCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTimevaultProgram, useTimevaultProgramAccount } from "@/lib/vaultClient";
import { PublicKey } from "@solana/web3.js";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProgramAccount } from '@coral-xyz/anchor';
import { BN } from '@coral-xyz/anchor';

const Dashboard = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const { accounts, getProgramAccount } = useTimevaultProgram();

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }
  }, [connected, router]);

  useEffect(() => {
    if (accounts.data) {
      accounts.refetch();
    }
  }, [accounts]);

  if (!connected) {
    return null;
  }

  if (getProgramAccount.isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  if (!getProgramAccount.data?.value) {
    return (
      <Layout>
        <div className="alert alert-info flex justify-center">
          <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Time Vaults</h1>
            <p className="text-gray-300 ">
              Manage and access your time-locked content
            </p>
            <p className="text-gray-500 text-xs">Displaying vaults can take few seconds. Please wait.</p>
          </div>
          
          <Button 
            onClick={() => router.push('/create')} 
            className="mt-4 md:mt-0 bg-vault-accent hover:bg-vault-accent/80 flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Vault
          </Button>
        </div>
        
        {accounts.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : accounts.data?.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <Lock className="h-16 w-16 mx-auto text-vault-secondary mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No Vaults Yet</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              You haven't created any time vaults yet. Create your first vault to get started!
            </p>
            <Button 
              onClick={() => router.push('/create')} 
              className="bg-vault-accent hover:bg-vault-accent/80"
            >
              Create Your First Vault
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {accounts.data?.filter((account: ProgramAccount<any>) => 
              account !== null && 
              account.account && 
              account.account.creator === publicKey?.toString()
            ).map((account: any) => (
              <Card 
                key={account.publicKey.toString()} 
                account={account.publicKey} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

function Card({ account }: { account: PublicKey }) {
  const { accountQuery } = useTimevaultProgramAccount({account});
  const router = useRouter();
  const vaultData = accountQuery.data;
  const now = new BN(Math.floor(Date.now() / 1000));
  const isUnlockable = vaultData?.unlockTime ? now.gte(vaultData.unlockTime) : false;
  const [clicked, setClicked] = useState(false);
  const [loadedContent, setLoadedContent] = useState("");

  function formatTime(seconds: BN): string {
    const secondsInHour = new BN(3600);
    const secondsInMinute = new BN(60);
    
    const hours = seconds.div(secondsInHour).toNumber();
    const remainingSeconds = seconds.mod(secondsInHour);
    const minutes = remainingSeconds.div(secondsInMinute).toNumber();
    const secs = remainingSeconds.mod(secondsInMinute).toNumber();
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  const formattedTime = vaultData?.unlockTime ? formatTime(vaultData.unlockTime) : '00:00:00';

  const getContentTypeIcon = () => {
    switch (vaultData?.contentType) {
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
    if (!vaultData?.unlockTime) return 'Loading...';
    
    const timeDiff = vaultData.unlockTime.sub(now);
    
    // If time difference is negative, it's already unlocked
    if (timeDiff.lt(new BN(0))) {
      return 'Ready to unlock!';
    }
    
    const secondsInDay = new BN(86400);
    const secondsInHour = new BN(3600);
    const secondsInMinute = new BN(60);
    
    const diffDays = timeDiff.div(secondsInDay).toNumber();
    const remainingSeconds = timeDiff.mod(secondsInDay);
    const diffHrs = remainingSeconds.div(secondsInHour).toNumber();
    const remainingMinutes = remainingSeconds.mod(secondsInHour);
    const diffMins = remainingMinutes.div(secondsInMinute).toNumber();
    
    if (diffDays > 0) {
      return `Unlocks in ${diffDays}d ${diffHrs}h`;
    } else if (diffHrs > 0) {
      return `Unlocks in ${diffHrs}h ${diffMins}m`;
    } else {
      return `Unlocks in ${diffMins}m`;
    }
  };

  useEffect(() => {
    const loadText = async () => {
      if (!vaultData?.contentUri || !isUnlockable) return;
  
      try {
        const res = await fetch(vaultData.contentUri);
        const text = await res.text();
        setLoadedContent(text);
      } catch (e) {
        console.error("Failed to load content:", e);
      }
    };
  
    loadText();
  }, [vaultData?.contentUri, isUnlockable]);

  return (
    <div
      className={cn(
        'glass-card rounded-xl overflow-hidden border border-vault-accent/30 my-2',
        isUnlockable && 'animate-pulse-glow'
      )}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getContentTypeIcon()}</span>
            <h3 className="text-lg font-semibold text-white">{vaultData?.title}</h3>
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
            <span>Created: {new Date(Number(vaultData?.createdAt) * 1000).toLocaleDateString()}</span>
          </div>
          
          <div className="text-sm grid">
            <span className="text-gray-400">Unlock date:</span>
            <p className="text-vault-light font-medium">
              {new Date(Number(vaultData?.unlockTime) * 1000).toLocaleDateString()}
            </p>
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
            onClick={() => setClicked((prev) => !prev)}
            className={cn(
              "w-full",
              isUnlockable 
                ? "bg-vault-accent hover:bg-vault-accent/80" 
                : "bg-vault-dark/50 text-gray-300 hover:bg-vault-dark"
            )}
            disabled={!isUnlockable}
          >
            {isUnlockable ? 'View Content' : 'Locked'}
          </Button>
          
          {clicked && isUnlockable && vaultData && (
            <div className="mt-4">
              <div className="grid justify-center pt-5">
                {vaultData.contentType === 'text' ? 
                  <pre className="text-vault-light text-sm text-wrap">{loadedContent}</pre> : 
                  vaultData.contentType === 'image' ? 
                  <Image 
                    src={vaultData.contentUri} 
                    alt="Vault content" 
                    width={200} 
                    height={100} 
                    className="max-w-full" 
                  /> : 
                  vaultData.contentType === 'video' ? 
                  <video controls src={vaultData.contentUri} className="w-full" /> : 
                  <a 
                    href={vaultData.contentUri} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-vault-accent hover:text-vault-accent/80"
                  >
                    Download File
                  </a> 
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}