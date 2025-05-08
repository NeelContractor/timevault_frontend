'use client';

import { ReactNode } from 'react';
import { WalletProviders } from './wallet-providers';
import { ThemeProvider } from './theme-provider';
import { ReactQueryProvider } from '@/app/react-query-provider';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
      >
        <WalletProviders>
          {children}
        </WalletProviders>
      </ThemeProvider>
    </ReactQueryProvider>
  );
} 