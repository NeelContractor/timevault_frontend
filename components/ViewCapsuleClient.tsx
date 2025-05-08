// 'use client';

// import { useEffect, useState } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { redirect, useParams } from 'next/navigation';
// import { Navbar } from '@/components/navbar';
// import { StarField } from '@/components/star-field';
// import { CapsuleViewer } from '@/components/capsule-viewer';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { useTimeCapsules } from '@/hooks/use-time-capsules';
// import { Skeleton } from '@/components/ui/skeleton';

// export default function ViewCapsule() {
//   const { connected } = useWallet();
//   const params = useParams();
//   const capsuleId = params.id as string;
//   const { capsules, loading } = useTimeCapsules();
//   const [capsule, setCapsule] = useState<any>(null);

//   useEffect(() => {
//     if (!connected) {
//       redirect('/');
//     }
//   }, [connected]);

//   useEffect(() => {
//     if (capsules.length > 0) {
//       const foundCapsule = capsules.find(c => c.id === capsuleId);
//       if (foundCapsule) {
//         setCapsule(foundCapsule);
//       } else {
//         redirect('/dashboard');
//       }
//     }
//   }, [capsules, capsuleId]);

//   if (!connected) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen pb-20">
//       <StarField />
//       <Navbar />
//       <div className="container mx-auto px-4 pt-20">
//         <div className="max-w-4xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Link href="/dashboard">
//               <Button variant="ghost" className="mb-4 gap-2">
//                 <ArrowLeft size={16} />
//                 Back to Dashboard
//               </Button>
//             </Link>
//           </motion.div>
          
//           {loading || !capsule ? (
//             <div className="space-y-4">
//               <Skeleton className="h-12 w-3/4" />
//               <Skeleton className="h-6 w-1/2" />
//               <div className="mt-8">
//                 <Skeleton className="h-[400px] w-full rounded-xl" />
//               </div>
//             </div>
//           ) : (
//             <CapsuleViewer capsule={capsule} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export async function generateStaticParams() {
//   // Example: fetch or hardcode list of IDs to statically generate
//   const ids = ['1', '2', '3']; // Replace with your actual logic or fetched IDs
//   return ids.map((id) => ({ id }));
// }