'use client'

import { getTimevaultProgram, getTimevaultProgramId } from '@/lib/timevault-export'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../providers/wallet-providers'
import { BN } from '@coral-xyz/anchor'

interface CreateVaultArgs {
    unlock_time: number
    content_uri: string,
    content_type: string,
    title: string,
}


export function useTimevaultProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
//   const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getTimevaultProgramId(cluster.network as Cluster), [cluster])
  const program = getTimevaultProgram(provider);

  const accounts = useQuery({
    queryKey: ['timevault', 'all', { cluster }],
    queryFn: () => program.account.timeCapsule.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const creatTimevaultAccount = useMutation<string, Error, CreateVaultArgs>({
    mutationKey: ['timevault', 'create', { cluster }],
    mutationFn: ({ unlock_time, content_uri, content_type, title }) =>
      program.methods
        .createCapsule(new BN(unlock_time), title, content_type, content_uri)
        .signers([])
        .rpc(),
    onSuccess: (signature) => {
        console.log("successful: ", signature);
    //   transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    creatTimevaultAccount,
  }
}

// export function useTokenvestingProgramAccount({ account }: { account: PublicKey }) {
//   const { cluster } = useCluster()
//   const transactionToast = useTransactionToast()
//   const { program, accounts } = useTokenvestingProgram()

//   const accountQuery = useQuery({
//     queryKey: ['tokenvesting', 'fetch', { cluster, account }],
//     queryFn: () => program.account.vestingAccount.fetch(account),
//   })

//   const createEmployeeVesting = useMutation<string, Error, CreateEmployeeArgs>({
//     mutationKey: ['tokenvesting', 'create', { cluster, account }],
//     mutationFn: ({ startTime, endTime, totalAmount, cliffTime }) => 
//       program.methods
//       // @ts-ignore
//       .createEmployeeVesting(startTime, endTime, totalAmount, cliffTime)
//       .rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accounts.refetch();
//     },
//     onError: (error) => {
//       console.log("error while creating Employee vesting account :", error);
//     }
//   })

//   return {
//     accountQuery,
//     createEmployeeVesting
//   }
// }