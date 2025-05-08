'use client';

import Link from 'next/link';
import { WalletMultiButton } from './ui/wallet-multi-button';
import { Button } from './ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Clock3 } from 'lucide-react';

export function Navbar() {
  const { connected } = useWallet();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              href="/"
              className="flex items-center gap-2 font-heading font-bold text-xl"
            >
              <Clock3 className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span>Chrono Vault</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            {connected ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <WalletMultiButton />
              </div>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}