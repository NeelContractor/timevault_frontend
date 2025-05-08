"use client"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { Lock, Unlock, ArrowLeft, AlertTriangle } from "lucide-react";
import Layout from "@/components//Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VaultData } from "@/components/VaultCard";
import { useRouter } from "next/navigation";

const ViewVault = () => {
  const { id } = useParams<{ id: string }>();
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [vault, setVault] = useState<VaultData | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [canUnlock, setCanUnlock] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!connected || !publicKey) {
      router.push('/');
      return;
    }

    if (!id) {
      router.push('/dashboard');
      return;
    }

    const loadVault = () => {
      try {
        setLoading(true);

        // In a real application, we would fetch from Solana blockchain
        const storedVaults = localStorage.getItem(`solVaults_${publicKey.toString()}`);
        if (!storedVaults) {
          router.push('/dashboard');
          return;
        }

        const vaults = JSON.parse(storedVaults);
        const foundVault = vaults.find((v: any) => v.id === id);

        if (!foundVault) {
          toast.error("Vault not found");
          router.push('/dashboard');
          return;
        }

        // Convert string dates to Date objects
        const processedVault = {
          ...foundVault,
          createdAt: new Date(foundVault.createdAt),
          unlockTime: new Date(foundVault.unlockTime),
        };

        const now = new Date();
        const canUnlockVault = now >= processedVault.unlockTime;

        setVault(processedVault);
        setCanUnlock(canUnlockVault);

        // Only load content if the vault is unlocked
        if (canUnlockVault) {
          const vaultContent = localStorage.getItem(`vault_content_${id}`);
          setContent(vaultContent);
          
          if (processedVault.contentType !== 'text') {
            const storedFileName = localStorage.getItem(`vault_filename_${id}`);
            setFileName(storedFileName);
          }
          
          setIsUnlocked(true);
        }
      } catch (error) {
        console.error("Error loading vault:", error);
        toast.error("Failed to load vault");
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadVault();
  }, [connected, router, publicKey, id]);

  const handleUnlock = () => {
    if (!vault || !canUnlock) return;

    try {
      // In a real application, we would verify on the Solana blockchain
      // For demo, we'll just mark it as unlocked in localStorage
      const storedVaults = localStorage.getItem(`solVaults_${publicKey!.toString()}`);
      if (storedVaults) {
        const vaults = JSON.parse(storedVaults);
        const updatedVaults = vaults.map((v: any) => 
          v.id === id ? { ...v, isUnlocked: true } : v
        );
        localStorage.setItem(`solVaults_${publicKey!.toString()}`, JSON.stringify(updatedVaults));
      }

      const vaultContent = localStorage.getItem(`vault_content_${id}`);
      setContent(vaultContent);
      
      if (vault.contentType !== 'text') {
        const storedFileName = localStorage.getItem(`vault_filename_${id}`);
        setFileName(storedFileName);
      }
      
      setIsUnlocked(true);
      toast.success("Time vault unlocked!");
    } catch (error) {
      console.error("Error unlocking vault:", error);
      toast.error("Failed to unlock vault");
    }
  };

  if (!connected) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vault-accent mb-4"></div>
          <p className="text-vault-light">Loading vault...</p>
        </div>
      </Layout>
    );
  }

  if (!vault) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-xl text-white mb-4">Vault not found</p>
          <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  const renderContent = () => {
    if (!isUnlocked) {
      return (
        <div className="glass-card rounded-xl p-8 mt-8 text-center">
          <Lock className="h-16 w-16 mx-auto text-vault-secondary mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">This vault is still locked</h3>
          
          {canUnlock ? (
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-vault-accent">The unlock time has passed! You can now access the contents.</p>
              <Button 
                onClick={handleUnlock} 
                className="bg-vault-accent hover:bg-vault-accent/80 mt-4"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Unlock Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-gray-300">
                This vault will unlock on <span className="text-vault-light">{format(vault.unlockTime, "MMMM d, yyyy 'at' h:mm a")}</span>
              </p>
              <p className="text-sm text-gray-400">
                Please check back after the unlock time to view the contents.
              </p>
            </div>
          )}
        </div>
      );
    }

    switch (vault.contentType) {
      case 'text':
        return (
          <div className="glass-card rounded-xl p-8 mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Content</h3>
            <div className="bg-vault-dark/30 p-6 rounded-lg border border-vault-accent/20">
              <p className="text-white whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="glass-card rounded-xl p-8 mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Image</h3>
            <div className="bg-vault-dark/30 p-4 rounded-lg border border-vault-accent/20">
              <img 
                src={content || ''} 
                alt={fileName || 'Vault image'} 
                className="max-w-full max-h-[600px] mx-auto rounded-lg" 
              />
            </div>
            {fileName && (
              <p className="text-sm text-gray-400 mt-2 text-center">{fileName}</p>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="glass-card rounded-xl p-8 mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Video</h3>
            <div className="bg-vault-dark/30 p-4 rounded-lg border border-vault-accent/20">
              <video 
                src={content || ''} 
                controls 
                className="max-w-full max-h-[600px] mx-auto rounded-lg" 
              />
            </div>
            {fileName && (
              <p className="text-sm text-gray-400 mt-2 text-center">{fileName}</p>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="glass-card rounded-xl p-8 mt-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">File</h3>
            <div className="bg-vault-dark/30 p-8 rounded-lg border border-vault-accent/20 flex flex-col items-center">
              <p className="text-vault-light mb-4">{fileName}</p>
              <Button 
                onClick={() => {
                  // Create a download link
                  const link = document.createElement('a');
                  link.href = content || '';
                  link.download = fileName || 'download';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-vault-accent hover:bg-vault-accent/80"
              >
                Download File
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="glass-card rounded-xl p-8 mt-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Content Error</h3>
            <p className="text-gray-300">
              Unable to display the content. The content type is not supported.
            </p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="text-vault-light hover:text-white mb-6 pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="glass-card rounded-xl p-6 md:p-8 border border-violet-500/20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">{vault.title}</h1>
            {isUnlocked ? (
              <div className="flex items-center text-vault-accent">
                <Unlock className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Unlocked</span>
              </div>
            ) : canUnlock ? (
              <div className="flex items-center text-vault-accent">
                <Lock className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Ready to unlock</span>
              </div>
            ) : (
              <div className="flex items-center text-vault-secondary">
                <Lock className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Locked</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-4 rounded-lg">
              <p className="text-sm text-gray-400">Created</p>
              <p className="text-vault-light">{format(vault.createdAt, "MMM d, yyyy")}</p>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <p className="text-sm text-gray-400">Unlocks On</p>
              <p className={`${canUnlock ? 'text-vault-accent' : 'text-vault-light'}`}>
                {format(vault.unlockTime, "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default ViewVault;
