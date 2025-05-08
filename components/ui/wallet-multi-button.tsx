'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { Button } from '@/components/ui/button';
import { Loader2, WalletIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WalletMultiButton({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);
  const { 
    publicKey, 
    wallet, 
    disconnect, 
    wallets, 
    select, 
    connecting, 
    connected, 
    disconnecting 
  } = useWallet();

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getWalletName = () => {
    if (connecting) return 'Connecting...';
    if (disconnecting) return 'Disconnecting...';
    if (connected && wallet) return wallet.adapter.name;
    return 'Connect Wallet';
  };

  if (!wallet || !connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={className}
            disabled={connecting || disconnecting}
          >
            {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WalletIcon className="mr-2 h-4 w-4" />}
            {getWalletName()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {wallets.filter(wallet => wallet.readyState === WalletReadyState.Installed || wallet.readyState === WalletReadyState.Loadable).map((wallet) => (
            <DropdownMenuItem
              key={wallet.adapter.name}
              onClick={() => select(wallet.adapter.name)}
            >
              {wallet.adapter.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={active} onOpenChange={setActive}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <WalletIcon className="mr-2 h-4 w-4" />
          {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyAddress}>
          {copied ? 'Copied!' : 'Copy address'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => disconnect()}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}