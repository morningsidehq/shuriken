'use client'

/**
 * This module provides Supabase authentication and client functionality through React Context.
 * For more details on authentication flow, see Authentication section in app-documentation.md
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'

/**
 * Type definition for the Supabase context value
 */
interface SupabaseContextType {
  supabase: SupabaseClient
  session: Session | null
}

// Create context with undefined default value
const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined,
)

// Define public routes where we don't need to handle session errors
const PUBLIC_ROUTES = ['/login', '/signup', '/logout', '/reset-password']

/**
 * Provider component that wraps the app and provides Supabase client and session state
 * See "Authentication Provider Setup" in app-documentation.md for implementation details
 */
export default function SupabaseProvider({
  children,
  session: initialSession,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const [supabase] = useState(() => createBrowserClient())
  const [session, setSession] = useState<Session | null>(initialSession)
  const router = useRouter()
  const [isHandlingAuth, setIsHandlingAuth] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      // Prevent handling auth if we're already doing it
      if (isHandlingAuth) return
      setIsHandlingAuth(true)

      try {
        // Handle sign out event specifically
        if (event === 'SIGNED_OUT') {
          setSession(null)
          // Only redirect if not already on auth pages
          const currentPath = window.location.pathname
          if (!PUBLIC_ROUTES.some((route) => currentPath.startsWith(route))) {
            router.push('/login')
          }
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession)
          router.refresh()
          return
        }

        // For session expiry, handle it once and redirect
        if (event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
          if (!newSession) {
            setSession(null)
            router.push('/login?message=Session expired, please log in again.')
          }
        }
      } finally {
        setIsHandlingAuth(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, isHandlingAuth])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

/**
 * Custom hook to access Supabase context
 * See "Using Supabase in Components" in app-documentation.md for usage examples
 */
export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
