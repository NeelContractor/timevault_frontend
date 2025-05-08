'use client'

import React, { ReactNode, useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}