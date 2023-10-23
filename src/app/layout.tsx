
import ChackraProviders from '@/components/profile-popover/providers/chackraProvider'
import NextAuSessionProvider from '@/components/profile-popover/providers/sessionProvidesr'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crm RiberMax',
  description: 'Crm de vendas RiberMax',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-Br">
      <ChackraProviders>
        <NextAuSessionProvider>
          <body className={inter.className}>{children}</body>
        </NextAuSessionProvider>
      </ChackraProviders>
    </html>
  )
}