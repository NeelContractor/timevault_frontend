'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Capsule } from '@/types/capsule';

// Local storage key for capsules 
const STORAGE_KEY = 'time-capsules';

export function useTimeCapsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  
  // Get user-specific key
  const getUserStorageKey = () => {
    if (!publicKey) return null;
    return `${STORAGE_KEY}-${publicKey.toString()}`;
  };
  
  // Load capsules from storage
  useEffect(() => {
    const loadCapsules = () => {
      setLoading(true);
      
      const storageKey = getUserStorageKey();
      if (!storageKey) {
        setCapsules([]);
        setLoading(false);
        return;
      }
      
      try {
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          
          // Convert string dates back to Date objects
          const capsules = parsed.map((capsule: any) => ({
            ...capsule,
            createdAt: new Date(capsule.createdAt),
            unlockTime: new Date(capsule.unlockTime),
          }));
          
          setCapsules(capsules);
        } else {
          setCapsules([]);
        }
      } catch (error) {
        console.error('Error loading capsules:', error);
        setCapsules([]);
      }
      
      setLoading(false);
    };
    
    loadCapsules();
  }, [publicKey]);
  
  // Save capsules to storage
  const saveCapsules = (updatedCapsules: Capsule[]) => {
    const storageKey = getUserStorageKey();
    if (!storageKey) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedCapsules));
    } catch (error) {
      console.error('Error saving capsules:', error);
    }
  };
  
  // Add a new capsule
  const addCapsule = (capsule: Capsule) => {
    const updatedCapsules = [...capsules, capsule];
    setCapsules(updatedCapsules);
    saveCapsules(updatedCapsules);
  };
  
  // Delete a capsule
  const deleteCapsule = (id: string) => {
    const updatedCapsules = capsules.filter(c => c.id !== id);
    setCapsules(updatedCapsules);
    saveCapsules(updatedCapsules);
  };
  
  return {
    capsules,
    loading,
    addCapsule,
    deleteCapsule,
  };
}