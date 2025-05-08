"use client"
import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from 'next/dynamic';
import { Lock, Unlock } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Dynamically import WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: FC<LayoutProps> = ({ children, className }) => {
  const { connected } = useWallet();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-card px-4 py-4 border-b border-violet-900/20">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Lock className="text-vault-accent h-6 w-6" />
              <h1 className="text-2xl font-bold text-white">Time Vault</h1>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {connected && (
              <>
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="ghost" 
                  className="text-white hover:text-vault-accent"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => router.push('/create')} 
                  variant="outline" 
                  className="text-white border-vault-accent hover:bg-vault-accent/20"
                >
                  Create Vault
                </Button>
              </>
            )}
            <WalletMultiButton />
          </div>
        </div>
      </header>
      
      <main className={cn("flex-1 container py-8", className)}>
        {children}
      </main>
      
      <footer className="glass-card py-6 border-t border-violet-900/20">
        <div className="container max-w-7xl mx-auto text-center text-sm text-gray-400">
            <p>Made by <Link href="https://github.com/NeelContractor" className="text-vault-accent">Neel Contractor</Link></p>
          <p>© 2025 Time Vault. Powered by Solana.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
