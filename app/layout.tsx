import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space'
});

// Dynamically import the client-side providers wrapper
const ClientProviders = dynamic(
  () => import('@/components/providers/client-providers'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Time Vault',
  description: 'Time Vault is a simple and secure way to store your memories in the future.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ClientProviders>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}