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

  useEffect(() => {
    // Subscribe to auth state changes and update session accordingly
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      // Verify current user
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Error verifying user:', error)
        setSession(null)
        router.refresh()
        return
      }

      // Update session if user exists and access token has changed
      if (user && newSession?.access_token !== session?.access_token) {
        setSession(newSession)
      }

      router.refresh()
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, session])

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
