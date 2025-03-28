'use client';
import { SessionProvider } from "next-auth/react"

// Provides authentication context to the app  
   
export default function Providers({ children }: {children: React.ReactNode}) {
  return <SessionProvider>{children}</SessionProvider>;
  }