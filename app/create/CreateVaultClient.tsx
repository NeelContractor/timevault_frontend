"use client"

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Lock, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTimevaultProgram } from "@/lib/vaultClient";
import dynamic from 'next/dynamic';

// Dynamically import client components with no SSR
const DynamicLayout = dynamic(() => import("@/components/Layout"), { ssr: false });
const DynamicTimeInput = dynamic(() => import("@/components/TimeInput"), { ssr: false });
const DynamicContentUploader = dynamic(() => import("@/components/ContentUploader"), { ssr: false });

const CreateVaultClient = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [unlockTimeSeconds, setUnlockTimeSeconds] = useState(0);
  const [content, setContent] = useState<string | File>("");
  const [contentType, setContentType] = useState<'text' | 'image' | 'video' | 'file'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTimevaultAccount } = useTimevaultProgram();

  const handleContentChange = (newContent: string | File, type: 'text' | 'image' | 'video' | 'file') => {
    setContent(newContent);
    setContentType(type);
  };

  const handleTimeChange = (seconds: number) => {
    setUnlockTimeSeconds(seconds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!title) {
      toast.error("Please enter a title for your vault");
      return;
    }
    
    if (unlockTimeSeconds <= 0) {
      toast.error("Please set a valid unlock time");
      return;
    }
    
    if (!content) {
      toast.error("Please add content to your vault");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Creating vault...");
      
      const unlockTimeUnix = unlockTimeSeconds; // Use the seconds directly
      console.log("unlockTimeUnix:", unlockTimeUnix);

      let signedUrl;
      // Create FormData and handle content type
      const data = new FormData();

      console.log("Content type:", typeof content, content);
      if (typeof content === "string") {
        // Convert string content to a Blob/File
        const blob = new Blob([content], { type: "text/plain" });
        const file = new File([blob], "vault.txt", { type: "text/plain" });
        data.set("file", file);
      } else if (content instanceof File) {
        data.set("file", content);
      } else {
        console.error("Invalid content value:", content);
        toast.error("Unsupported content type. Must be text or a file.");
        setIsSubmitting(false);
        return;
      }

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const response = await uploadRequest.json();

      if (response.error) {
        toast.error("IPFS upload failed");
        return;
      }

      signedUrl = response.url;
      console.log("File uploaded to IPFS:", signedUrl);

      console.log("Creating time vault account...");
      const res = await createTimevaultAccount.mutateAsync({
        unlock_time: unlockTimeUnix,
        title,
        content_uri: signedUrl,
        content_type: contentType,
        // userPubkey: publicKey
      });
      
      console.log("Time vault created:", res);
      toast.success("Time vault created successfully!");
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Error creating vault:", error);
      toast.error("Failed to create time vault");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use useEffect for client-side navigation
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  if (!isClient) {
    return null;
  }

  return (
    <DynamicLayout>
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="text-vault-light hover:text-white mb-6 pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="glass-card rounded-xl p-6 md:p-8 border border-violet-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-vault-accent" />
            <h1 className="text-2xl font-bold text-white">Create a New Time Vault</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="title" className="text-white">Vault Title</Label>
              <Input
                id="title"
                placeholder="Enter a name for your vault"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-vault-dark/50 border-vault-accent/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-vault-accent" />
                <Label className="text-white">Time Until Unlock</Label>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Set how long this vault should remain locked
              </p>
              <DynamicTimeInput onChange={handleTimeChange} />
            </div>
            
            <div className="space-y-4">
              <Label className="text-white">Vault Content</Label>
              <DynamicContentUploader onContentChange={handleContentChange} />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-vault-accent hover:bg-vault-accent/80 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating Vault...
                </div>
              ) : (
                'Create Time Vault'
              )}
            </Button>
          </form>
          <div className="mt-4">
            <h3 className="text-red-500 text-sm text-center font-bold bg-vault-dark/50 p-2 rounded-md">
              Please wait for the transaction to be confirmed. This may take a few minutes.
            </h3>
          </div>
        </div>
      </div>
    </DynamicLayout>
  );
};

export default CreateVaultClient; 