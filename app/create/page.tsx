import * as dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamically import the client component with no SSR
const CreateVaultClient = dynamicImport.default(() => import('./CreateVaultClient'), { ssr: false });

export default function CreateVaultPage() {
  return <CreateVaultClient />;
}
