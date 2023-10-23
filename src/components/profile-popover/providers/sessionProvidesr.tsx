'use client'

import { SessionProvider } from "next-auth/react"

interface NextAuSessionProviderProps {
  children: React.ReactNode
}

export default function NextAuSessionProvider({children}: NextAuSessionProviderProps) {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}