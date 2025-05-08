'use client'

import { getTimevaultProgram, getTimevaultProgramId } from './timevault-export'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../components/cluster/cluster-data-access'
import { useAnchorProvider } from '../components/providers/wallet-providers'
import { BN } from '@coral-xyz/anchor'

interface CreateVaultArgs {
    unlock_time: number,
    title: string,
    content_uri: string,
    content_type: "text" | "image" | "video" | "file",
}

export function useTimevaultProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const { publicKey } = useWallet()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getTimevaultProgramId("devnet" as Cluster), [cluster])
  const program = getTimevaultProgram(provider);

  const accounts = useQuery({
    queryKey: ['timevault', 'all', { cluster, publicKey: publicKey?.toString() }],
    queryFn: async () => {
      if (!program) {
        throw new Error('Program not initialized');
      }
      if (!programId) {
        throw new Error('Program ID not initialized');
      }
      if (!connection) {
        throw new Error('Connection not initialized');
      }
      if (!publicKey) {
        return [];
      }

      const maxRetries = 2; // Reduced retries
      const retryDelay = 4000; // 4 seconds
      const batchSize = 1; // Process one account at a time
      const batchDelay = 4000; // 4 seconds between batches

      const fetchWithRetry = async (retryCount = 0): Promise<any> => {
        try {
          // First verify the program ID
          // console.log('Program ID:', programId.toString());
          
          // Verify program exists
          const programInfo = await connection.getAccountInfo(programId);
          if (!programInfo) {
            throw new Error(`Program not found at ${programId.toString()}`);
          }
          // console.log('Program found:', programInfo.owner.toString());
          
          // Get accounts owned by the program AND created by the current wallet
          const accounts = await connection.getProgramAccounts(programId, {
            filters: [
              {
                memcmp: {
                  offset: 8, // After discriminator
                  bytes: publicKey.toBase58(), // Creator public key
                },
              },
            ],
            commitment: 'confirmed', // Use confirmed commitment for better performance
            dataSlice: { offset: 0, length: 44 }, // Only fetch the minimum required data initially
          });
          // console.log('Found accounts:', accounts.length);
          
          if (accounts.length === 0) {
            // console.log('No accounts found for program');
            return [];
          }

          // Process accounts one at a time with longer delays
          const results = [];
          
          for (let i = 0; i < accounts.length; i++) {
            const acc = accounts[i];
            // console.log(`Processing account ${i + 1} of ${accounts.length}`);
            
            try {
              // Fetch full account data only when needed
              const fullAccount = await connection.getAccountInfo(acc.pubkey, {
                commitment: 'confirmed',
              });
              
              if (!fullAccount?.data) {
                // console.log(`Account ${acc.pubkey.toString()} has no data`);
                continue;
              }

              const data = fullAccount.data;
              // console.log(`Processing account ${acc.pubkey.toString()} with data length:`, data.length);
              
              // Handle new/empty accounts
              if (data.length === 0) {
                // console.log(`Account ${acc.pubkey.toString()} is empty`);
                continue;
              }
              
              // Validate minimum data length
              if (data.length < 44) { // 8 (discriminator) + 32 (creator) + 4 (title length)
                // console.log(`Account ${acc.pubkey.toString()} data too short (likely new/empty):`, {
                //   dataLength: data.length,
                //   minimumRequired: 44
                // });
                continue;
              }
              
              // Verify discriminator for valid accounts
              const discriminator = data.slice(0, 8).toString('hex');
              if (discriminator === '0000000000000000') {
                // console.log(`Account ${acc.pubkey.toString()} has zero discriminator (likely new/empty)`);
                continue;
              }
              
              // Calculate offsets for variable-length fields
              const titleLength = data.readUInt32LE(40);
              const titleOffset = 44;
              const titleEnd = titleOffset + titleLength;
              
              // Validate title length
              if (titleEnd > data.length) {
                // console.error(`Account ${acc.pubkey.toString()} title too long:`, {
                //   titleLength,
                //   titleOffset,
                //   titleEnd,
                //   dataLength: data.length,
                //   rawData: data.slice(40, 44).toString('hex')
                // });
                continue;
              }
              
              const createdAtOffset = titleEnd;
              const createdAtEnd = createdAtOffset + 8;
              
              // Validate createdAt offset
              if (createdAtEnd > data.length) {
                // console.error(`Account ${acc.pubkey.toString()} data too short for createdAt:`, {
                //   offset: createdAtOffset,
                //   end: createdAtEnd,
                //   dataLength: data.length,
                //   titleLength,
                //   titleEnd
                // });
                continue;
              }
              
              const unlockTimeOffset = createdAtEnd;
              const unlockTimeEnd = unlockTimeOffset + 8;
              
              // Validate unlockTime offset
              if (unlockTimeEnd > data.length) {
                // console.error(`Account ${acc.pubkey.toString()} data too short for unlockTime:`, {
                //   offset: unlockTimeOffset,
                //   end: unlockTimeEnd,
                //   dataLength: data.length,
                //   createdAtEnd
                // });
                continue;
              }
              
              // Read contentType length
              const contentTypeLengthOffset = unlockTimeEnd;
              let contentTypeLength;
              try {
                contentTypeLength = data.readUInt32LE(contentTypeLengthOffset);
                // console.log(`Account ${acc.pubkey.toString()} contentType length:`, {
                //   length: contentTypeLength,
                //   offset: contentTypeLengthOffset,
                //   dataLength: data.length,
                //   rawBytes: data.slice(contentTypeLengthOffset, contentTypeLengthOffset + 4).toString('hex')
                // });

                // Validate contentType length
                if (contentTypeLength > 100) { // Reasonable maximum length for contentType
                  // console.error(`Account ${acc.pubkey.toString()} contentType length too large:`, {
                  //   contentTypeLength,
                  //   offset: contentTypeLengthOffset,
                  //   dataLength: data.length,
                  //   rawBytes: data.slice(contentTypeLengthOffset, contentTypeLengthOffset + 4).toString('hex'),
                  //   previousFields: {
                  //     titleLength,
                  //     titleEnd,
                  //     createdAtEnd,
                  //     unlockTimeEnd
                  //   }
                  // });
                  continue;
                }
              } catch (e: any) {
                // console.error(`Account ${acc.pubkey.toString()} failed to read contentType length:`, {
                //   offset: contentTypeLengthOffset,
                //   dataLength: data.length,
                //   error: e.message,
                //   rawBytes: data.slice(contentTypeLengthOffset, contentTypeLengthOffset + 4).toString('hex'),
                //   previousFields: {
                //     titleLength,
                //     titleEnd,
                //     createdAtEnd,
                //     unlockTimeEnd
                //   }
                // });
                continue;
              }
              
              const contentTypeOffset = contentTypeLengthOffset + 4;
              const contentTypeEnd = contentTypeOffset + contentTypeLength;
              
              // Validate contentType bounds
              if (contentTypeEnd > data.length) {
                // console.error(`Account ${acc.pubkey.toString()} contentType exceeds data length:`, {
                //   contentTypeLength,
                //   contentTypeOffset,
                //   contentTypeEnd,
                //   dataLength: data.length,
                //   unlockTimeEnd,
                //   rawBytes: data.slice(contentTypeLengthOffset, contentTypeLengthOffset + 4).toString('hex'),
                //   previousFields: {
                //     titleLength,
                //     titleEnd,
                //     createdAtEnd,
                //     unlockTimeEnd
                //   }
                // });
                continue;
              }
              
              // Read contentUri length
              const contentUriLengthOffset = contentTypeEnd;
              let contentUriLength;
              try {
                contentUriLength = data.readUInt32LE(contentUriLengthOffset);
              } catch (e: any) {
                // console.error(`Account ${acc.pubkey.toString()} failed to read contentUri length:`, {
                //   offset: contentUriLengthOffset,
                //   dataLength: data.length,
                //   error: e.message,
                //   rawData: data.slice(contentUriLengthOffset, contentUriLengthOffset + 4).toString('hex')
                // });
                continue;
              }
              
              // Validate contentUri length
              if (contentUriLength > 1000) { // Reasonable maximum length for contentUri
                // console.error(`Account ${acc.pubkey.toString()} contentUri length too large:`, {
                //   contentUriLength,
                //   offset: contentUriLengthOffset,
                //   dataLength: data.length,
                //   rawData: data.slice(contentUriLengthOffset, contentUriLengthOffset + 4).toString('hex')
                // });
                continue;
              }
              
              const contentUriOffset = contentUriLengthOffset + 4;
              const contentUriEnd = contentUriOffset + contentUriLength;
              
              // Validate contentUri bounds
              if (contentUriEnd > data.length) {
                // console.error(`Account ${acc.pubkey.toString()} contentUri exceeds data length:`, {
                //   contentUriLength,
                //   contentUriOffset,
                //   contentUriEnd,
                //   dataLength: data.length,
                //   contentTypeEnd,
                //   rawData: data.slice(contentUriLengthOffset, contentUriLengthOffset + 4).toString('hex')
                // });
                continue;
              }
              
              const accountData = {
                totalLength: data.length,
                discriminator: data.slice(0, 8).toString('hex'),
                creator: new PublicKey(data.slice(8, 40)).toString(),
                titleLength,
                title: data.slice(titleOffset, titleEnd).toString('utf8'),
                createdAt: new BN(data.slice(createdAtOffset, createdAtEnd)).toString(),
                unlockTime: new BN(data.slice(unlockTimeOffset, unlockTimeEnd)).toString(),
                contentTypeLength,
                contentType: data.slice(contentTypeOffset, contentTypeEnd).toString('utf8'),
                contentUriLength,
                contentUri: data.slice(contentUriOffset, contentUriEnd).toString('utf8'),
                isUnlocked: data[data.length - 1] === 1
              };
              
              // console.log(`Successfully processed account ${acc.pubkey.toString()}:`, {
              //   title: accountData.title,
              //   contentType: accountData.contentType,
              //   contentUri: accountData.contentUri,
              //   dataLength: data.length,
              //   offsets: {
              //     title: { start: titleOffset, end: titleEnd },
              //     createdAt: { start: createdAtOffset, end: createdAtEnd },
              //     unlockTime: { start: unlockTimeOffset, end: unlockTimeEnd },
              //     contentType: { start: contentTypeOffset, end: contentTypeEnd },
              //     contentUri: { start: contentUriOffset, end: contentUriEnd }
              //   }
              // });
              
              results.push({
                publicKey: acc.pubkey,
                account: accountData
              });
            } catch (e: any) {
              // console.error(`Failed to process account ${acc.pubkey.toString()}:`, {
              //   error: e.message,
              //   stack: e.stack,
              // });
            }
            
            // Add delay between accounts
            if (i < accounts.length - 1) {
              // console.log(`Waiting ${batchDelay}ms before next account...`);
              await new Promise(resolve => setTimeout(resolve, batchDelay));
            }
          }
          
          return results;
        } catch (error: any) {
          if (error?.message?.includes('429') && retryCount < maxRetries) {
            const delay = retryDelay * Math.pow(2, retryCount); // Exponential backoff
            // console.log(`Rate limited, retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(retryCount + 1);
          }
          throw error;
        }
      };

      return fetchWithRetry();
    },
    enabled: !!program && !!connection && !!programId && !!publicKey,
    retry: 2, // Reduced retries
    refetchOnWindowFocus: false,
    staleTime: 300000, // Consider data stale after 5 minutes
    gcTime: 600000, // Keep data in cache for 10 minutes
    refetchInterval: false, // Disable automatic refetching
  })
  // console.log("Query state:", {
  //   status: accounts.status,
  //   isLoading: accounts.isLoading,
  //   error: accounts.error,
  //   data: accounts.data
  // });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createTimevaultAccount = useMutation<string, Error, CreateVaultArgs>({
    mutationKey: ['timevault', 'create', { cluster }],
    mutationFn: ({ unlock_time, title, content_uri, content_type }) => {
      // Add a unique identifier to the unlock time to ensure unique PDAs
      const uniqueUnlockTime = new BN(unlock_time).add(new BN(Math.floor(Date.now() / 1000)));
      return program.methods
          .createCapsule(uniqueUnlockTime, title, content_type, content_uri)
          .signers([])
          .rpc();
    },
    onSuccess: (signature) => {
        console.log("successful: ", signature);
        return accounts.refetch()
    },
    onError: (error) => {
        console.error("Error creating vault:", error);
        toast.error('Failed to create time vault');
    },
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createTimevaultAccount,
  }
}

export function useTimevaultProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
//   const transactionToast = useTransactionToast()
  const { program, accounts } = useTimevaultProgram()

  const accountQuery = useQuery({
    queryKey: ['timevault', 'fetch', { cluster, account }],
    queryFn: () => program.account.timeCapsule.fetch(account),
  })

  const openTimevault = useMutation<string, Error, CreateVaultArgs>({
    mutationKey: ['openTimevault', 'open', { cluster, account }],
    mutationFn: () => 
      program.methods
        .openCapsule()
        .rpc(),
    onSuccess: (tx) => {
      console.log("successful open vault", tx);
      return accounts.refetch();
    },
    onError: (error) => {
      console.log("error while opening time vault account :", error);
    }
  })

  return {
    accountQuery,
    openTimevault
  }
}