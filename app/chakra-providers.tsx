// app/chakra-providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

export function ChakraProviders({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}