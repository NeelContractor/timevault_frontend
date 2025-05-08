"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Index = () => {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // If connected, redirect to dashboard
    if (connected) {
      // Uncomment this to auto-redirect to dashboard
      // router.push('/dashboard');
    }
  }, [connected, router]);

  return (
    <Layout className="px-4">
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center my-12 max-w-6xl mx-auto">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center px-3 py-1.5 bg-vault-accent/20 rounded-full mb-2">
            <Lock className="w-4 h-4 mr-2 text-vault-accent" />
            <span className="text-sm font-medium text-vault-accent">Powered by Solana</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Lock Your <span className="text-vault-accent">Digital Content</span> in Time
          </h1>
          
          <p className="text-lg text-gray-300 md:pr-12 leading-relaxed">
            Secure your messages, images, videos, and files in Solana-powered time vaults. 
            Set a future unlock date and ensure your content remains secure until then.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            {!connected ? (
              <div className="wallet-adapter-button-container">
                <WalletMultiButton className="wallet-adapter-button" />
              </div>
            ) : (
              <>
                <Button 
                  onClick={() => router.push('/create')} 
                  className="bg-vault-primary hover:bg-vault-primary/90 text-white"
                >
                  Create Time Vault
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="outline" 
                  className="border-vault-accent text-vault-accent hover:bg-vault-accent/20"
                >
                  View Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-xl">
          <div className="glass-card rounded-xl p-1 border border-violet-500/20 animate-pulse-glow">
            <div className="time-vault-gradient rounded-lg aspect-video flex items-center justify-center p-12">
              <div className="glass-card rounded-lg p-8 w-full aspect-square flex flex-col items-center justify-center">
                <Lock className="h-20 w-20 text-white mb-6" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Time-Locked Vault</h3>
                  <p className="text-sm text-gray-300">Unlocks on May 7, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto my-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Create time-locked vaults on Solana for your digital content with just a few simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl border border-violet-500/20">
            <div className="bg-vault-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-vault-accent">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
            <p className="text-gray-300">
              Link your Solana wallet to securely authenticate and access the platform.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-violet-500/20">
            <div className="bg-vault-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-vault-accent">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Create Vault</h3>
            <p className="text-gray-300">
              Upload your content, set a title, and choose when it should be unlocked.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-violet-500/20">
            <div className="bg-vault-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-vault-accent">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Access Later</h3>
            <p className="text-gray-300">
              Return after the unlock time to view your secure content.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
