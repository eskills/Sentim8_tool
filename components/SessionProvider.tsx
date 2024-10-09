"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export const SessionProvider = ({ children }) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}